import PropTypes from 'prop-types';

import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Container,
    Stack,
    Typography,
} from '@mui/material';

import { mainPageContent } from 'src/core/constants';

import { Footer, Header } from '../interface';
import { Button } from '../ui';

const MainPage = () => {
    return (
        <>
            <Header position="fixed">
                <Button link to="/register">
                    Реєстрація
                </Button>
            </Header>

            <Stack component="section" id="hero" height="100vh" marginTop="64px">
                <Container maxWidth="xl">
                    <Typography
                        color="primary"
                        component="h1"
                        variant="h1"
                        fontWeight={700}
                        align="center"
                        fontSize={60}
                    >
                        {mainPageContent.hero.title}
                    </Typography>

                    <Typography component="p" variant="p" align="center">
                        {mainPageContent.hero.text}
                    </Typography>
                    <Button>Спробувати</Button>
                </Container>
            </Stack>

            <Stack
                component="section"
                id="advantages"
                minHeight="740px"
                bgcolor="rgba(233,240,251,0.5)"
            >
                <Container maxWidth="xl">
                    <Typography
                        color="primary"
                        component="h1"
                        variant="h1"
                        fontWeight={700}
                        align="center"
                        fontSize={60}
                    >
                        {mainPageContent.advantages.title}
                    </Typography>
                    <Stack direction="row" gap={5} flexWrap="wrap">
                        {mainPageContent.advantages.cards.map(card => (
                            <CardItem key={card.title} {...card} />
                        ))}
                    </Stack>
                </Container>
            </Stack>

            <Stack component="section" id="companies" minHeight="740px">
                <Container maxWidth="xl">
                    <Typography
                        color="primary"
                        component="h1"
                        variant="h1"
                        fontWeight={700}
                        align="center"
                        fontSize={60}
                    >
                        {mainPageContent.companies.title}
                    </Typography>
                    <Stack direction="row" gap={5} flexWrap="wrap">
                        {mainPageContent.companies.logos.map(logo => (
                            <Box key={logo}>
                                <img
                                    src={logo}
                                    alt={logo}
                                    width="100%"
                                    height="100%"
                                    style={{ borderRadius: '20px' }}
                                />
                            </Box>
                        ))}
                    </Stack>
                    <Typography>{mainPageContent.companies.text}</Typography>
                </Container>
            </Stack>
            <Footer />
        </>
    );
};

const CardItem = ({ title, text, picture }) => {
    return (
        <Card sx={{ maxWidth: 280, borderRadius: '10px' }}>
            <CardMedia
                component="img"
                sx={{ height: 160 }}
                image={picture}
                title="green iguana"
            />
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    marginBottom={2}
                    fontSize="18px"
                    variant="h6"
                    component="h6"
                    align="center"
                    fontWeight={700}
                >
                    {title}
                </Typography>
                <Typography variant="body2" align="center">
                    {text}
                </Typography>
            </CardContent>
        </Card>
    );
};

CardItem.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    picture: PropTypes.string,
};

export default MainPage;
