import {useMutation} from "@tanstack/react-query";
import {authService} from "@/src/features/auth/services";
import {TypeLoginSchema} from "@/src/features/schemes";
import {toastMessageHandler} from "@/src/shared/utils";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export function useLoginMutation() {
    const router = useRouter();

    const {mutate:login, isPending: isLoadingLogin} = useMutation({
        mutationKey: ['login user'],
        mutationFn: ({values, recaptcha}:
                     {
                         values: TypeLoginSchema,
                         recaptcha: string
                     }) => authService.login(values,  recaptcha),
        onSuccess(data: any) {
            if (data.message) {
                toastMessageHandler(data);
            } else {
                toast.success('Успешная авторизация');
                router.push("/dashboard/settings");
            }
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return  {login, isLoadingLogin}
}