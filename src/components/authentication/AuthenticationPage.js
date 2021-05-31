import { Backdrop, Button, Card, CardContent, CircularProgress, Container, Grid, TextField, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

export default function AuthenticationPage(props) {
    const { authState, authDispatch } = useContext(AuthContext);
    const { login, password, isLoading, error, isLoggedIn } = authState;

    const handleChange = (prop) => ({ target: { value }}) => {
        authDispatch({ 
            type: "field", 
            fieldName: prop,
            payload: value,
        });
        authDispatch({ 
            type: "clearError", 
        });
    };

    const handleAuthentication = async (event) => {
        event.preventDefault();
        
        authDispatch({
            type: "login",
        });

        const handle = async () => {
            if (login !== "" && password !== "") {
                const [foundUser] = await (
                    await fetch(`http://localhost:3005/users?login=${login}`)
                ).json();

                console.log(foundUser, login)
                const isValid = (
                    foundUser?.login === login 
                    && foundUser?.password === password
                );

                if (isValid) {
                    authDispatch({ type: 'success' });
                } else {
                    authDispatch({ type: 'error' });
                }
            } else {
                authDispatch({ type: 'error' });
            }
        };

        setTimeout(handle, 1500);
    };

    return (
        <Container
            maxWidth="sm"
        >
            <Grid
                container
                justify="center"
                alignItems="center"
                style={{ marginTop: "5rem" }}
            >
                <Grid
                    item
                    container
                    justify="center"
                    alignItems="center"
                >
                    <form
                        onSubmit={handleAuthentication}
                    >
                        <Grid
                            item
                            container
                            justify="center"
                            alignItems="center"
                            direction={"column"}
                            spacing={2}
                        >
                            <Grid
                                item
                                container
                                justify="center"
                                alignItems="center"
                                direction={"column"}
                                spacing={1}
                            >
                                <Grid
                                    item
                                >
                                    <Typography variant="h3">
                                        Note Manager
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                >
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Entre na sua conta para gerenciar suas notas
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                container
                                justify="center"
                                alignItems="center"
                                direction={"column"}
                                spacing={2}                
                                style={{ marginTop: "2rem" }}
                            >
                                <Card variant="elevation">
                                    <CardContent>
                                        <Grid
                                            item
                                            container
                                            justify="center"
                                            alignItems="center"
                                            direction={"column"}
                                            spacing={2}                
                                        >
                                            <Grid
                                                item
                                            >
                                                <TextField 
                                                    label="Login"
                                                    name="login"
                                                    variant="outlined"
                                                    size="small"
                                                    value={login}
                                                    onChange={handleChange("login")}
                                                    error={error?.exists}
                                                    disabled={isLoading}
                                                    required
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                            >
                                                <TextField 
                                                    label="Senha"
                                                    name="password"
                                                    variant="outlined"
                                                    type="password"
                                                    size="small"
                                                    value={password}
                                                    onChange={handleChange("password")}
                                                    error={error?.exists}
                                                    disabled={isLoading}
                                                    required
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                container
                                                justify="center"
                                            >
                                                <Grid
                                                    item
                                                    md={12}
                                                >
                                                    <Button
                                                        type="submit"
                                                        style={{ width: "100%"}} 
                                                        variant="contained" 
                                                        color="primary" 
                                                        size="small"
                                                        disabled={isLoading}
                                                    >
                                                        Entrar
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <Backdrop open={isLoading} style={{ zIndex: 1 }}>
                <CircularProgress color="primary" />
            </Backdrop>
            {isLoggedIn && <Redirect to="/notes" />}
        </Container>
    );
}