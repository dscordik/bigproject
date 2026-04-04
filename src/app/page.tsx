import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="space-y-5 text-center">
            <h1 className='text-4xl font-bold'>Главная страница</h1>
            <Link href="/auth/login">
                <Button>Войти в аккаунт</Button>
            </Link>
        </div>
    );
}