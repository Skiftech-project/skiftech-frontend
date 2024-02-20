import Container from '@mui/material/Container';
import { TitleBlock } from '../ui';
import { FormBlock } from '../interface';

const CalculatorPage = () => {
    return (
        <Container maxWidth="xl" sx={{ marginTop: '70px' }}>
            <TitleBlock title="Калькулятор розсіяння зони випромінювання" />

            <FormBlock />

            <TitleBlock title="результати обчислень" />
        </Container>
    );
};

export default CalculatorPage;