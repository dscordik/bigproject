import {Html} from "@react-email/html";
import {Body, Heading, Link, Tailwind, Text} from "@react-email/components";
import * as React from "react";

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export function ConfirmationTemplate({domain, token}: ConfirmationTemplateProps)  {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    return (
        <Tailwind>
            <Html>
                <Body className="text-black">
                    <Heading>Подтврждение почты</Heading>
                    <Text>Привет! Чтобы подтвердить адрес перейди по ссылке</Text>
                    <Link href={confirmLink}>Подтверить почту</Link>
                </Body>
            </Html>
        </Tailwind>
    )
}