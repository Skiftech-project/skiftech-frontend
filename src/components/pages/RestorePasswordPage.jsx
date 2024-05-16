import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';

import { Stack, Typography } from '@mui/material';

import { useUserService } from 'src/core/services';
import { validationSchemaRestorePassword } from 'src/core/shemes';

import { Header } from '../interface';
import { Block, Button, InputPassword } from '../ui';

const RestorePasswordPage = () => {
    const { token } = useParams();
    const { dataLoadingStatus } = useSelector(state => state.restorePassword);
    const { restorePassword } = useUserService();

    console.log(token);

    const methods = useForm({
        defaultValues: {
            firstNewPassword: '',
            secondNewPassword: '',
        },
        resolver: yupResolver(validationSchemaRestorePassword),
        mode: 'all',
    });

    const { formState, handleSubmit } = methods;

    const handleFormSubmit = async data => {
        const response = await restorePassword(data.firstNewPassword);
    };

    return (
        <FormProvider {...methods}>
            <Stack
                height="100vh"
                alignItems="center"
                justifyContent="center"
                component="form"
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                <Header position="fixed" />

                <Block
                    padding="30px"
                    sx={{
                        width: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                    }}
                >
                    <Typography align="center" variant="h6">
                        Введіть новий пароль
                    </Typography>

                    <InputPassword
                        id="firstNewPassword"
                        name="firstNewPassword"
                        label="Перший новий пароль"
                    />

                    <InputPassword
                        id="secondNewPassword"
                        name="secondNewPassword"
                        label="Другий новий пароль"
                    />

                    {/* {errorMessage.trim() == 0 ? null : (
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    )} */}

                    <Stack
                        direction="column"
                        alignItems="start"
                        justifyContent="start"
                        gap={3}
                    >
                        <Button
                            disabled={!formState.isValid}
                            type="submit"
                            color="primary"
                            loading={dataLoadingStatus === 'loading'}
                        >
                            Відправити
                        </Button>
                    </Stack>
                </Block>
            </Stack>
        </FormProvider>
    );
};

export default RestorePasswordPage;