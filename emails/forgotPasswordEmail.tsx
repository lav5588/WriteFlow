import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
} from '@react-email/components';

interface ForgotPasswordEmailProps {
    username: string;
    resetLink: string;
}

export default function ForgotPasswordEmail({ username, resetLink }: ForgotPasswordEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Password Reset</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Here's your password reset link</Preview>
            <Section>
                <Row>
                    <Heading as="h2">Hello {username},</Heading>
                </Row>
                <Row>
                    <Text>
                        You requested a password reset. Please use the following link to reset your password:
                    </Text>
                </Row>
                <Row>
                    <Button
                        href={resetLink}
                        style={{ color: '#61dafb' }}
                    >
                        Reset Password
                    </Button>
                </Row>
                <Row>
                    <Text>
                        If you did not request this, please ignore this email.
                    </Text>
                </Row>
            </Section>
        </Html>
    );
}
