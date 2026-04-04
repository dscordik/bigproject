import {useMutation} from "@tanstack/react-query";
import {authService} from "@/src/features/auth/services";
import {TypeRegisterSchema} from "@/src/features/schemes";
import {toastMessageHandler} from "@/src/shared/utils";
import {toast} from "sonner";

export function useRegisterMutation() {
    const {mutate:register, isPending: isLoadingRegister} = useMutation({
        mutationKey: ['register user'],
        mutationFn: ({values, recaptcha}:
                     {
                         values: TypeRegisterSchema,
                         recaptcha: string
                     }) => authService.register(values,  recaptcha),
        onSuccess(data: any) {
            toastMessageHandler(data);
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return  {register, isLoadingRegister}
}