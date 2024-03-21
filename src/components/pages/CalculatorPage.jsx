import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Stack } from '@mui/material';

import { TitleBlock, Button, Block } from '../ui';
import { FormBlock } from '../interface';
import { validationSchemaCalc } from 'src/core/shemes';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CalculatorPage = () => {
    const [data, setData] = useState({});

    const methods = useForm({
        defaultValues: {
            plumeForm: 'ellipse',
            distance: '',
            spotHeight: '',
            spotWidth: '',
            angleWidth: '',
            angleHeight: '',
            sensitivity: '',
            power: '',
            minPlumeSize: '',
            distanceModuleThird: '',
        },
        resolver: yupResolver(validationSchemaCalc),
        mode: 'all',
    });

    const handleSubmit = data => {
        console.log(JSON.stringify(data, null, 2));
        setData(data);
    };

    const markdownData = `

Нижче приведені розрахунки у форматі **md**:

| Параметр | Значення   |
| ----- | ------- |
| distanceModuleThird  | ${data.distanceModuleThird || '-'} |
| minPlumeSize | ${data.minPlumeSize || '-'} |
| power | ${data.power || '-'} |
| sensitivity | ${data.sensitivity || '-'} |
| angleHeight | ${data.angleHeight || '-'} |
| angleWidth | ${data.angleWidth || '-'} |
| spotWidth | ${data.spotWidth || '-'} |
| spotHeight | ${data.spotHeight || '-'} |
| distance | ${data.distance || '-'} |
| plumeForm | ${data.plumeForm || '-'} |
`;

    return (
        <FormProvider {...methods}>
            <Stack sx={{ marginTop: '70px' }} direction="column" spacing={3}>
                <TitleBlock block>Калькулятор розсіяння зони випромінювання</TitleBlock>
                <FormBlock />
                <TitleBlock block>Результати обчислень</TitleBlock>

                <Block padding="30px">
                    <Markdown remarkPlugins={[remarkGfm]}>{markdownData}</Markdown>

                    <Button
                        disabled={!methods.formState.isValid}
                        onClick={methods.handleSubmit(handleSubmit)}
                        color="primary"
                    >
                        submit
                    </Button>
                </Block>
            </Stack>
        </FormProvider>
    );
};

export default CalculatorPage;
