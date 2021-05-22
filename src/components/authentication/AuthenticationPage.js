import { Button, Card, CardContent, Container, Grid, TextField, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import UserContext from "../../contexts/UserContext";

export default function AuthenticationPage(props) {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const { user, setUser } = useContext(UserContext);
    const [error, setError] = useState(false);


    const handleChange = (prop) => ({ target: { value }}) => {
        setUser({ ...user, [prop]: value });
        setError(false);
    };

    const handleAuthentication = async (event) => {
        event.preventDefault();

        if (user?.login !== "" && user?.password !== "") {
            const [foundUser] = await (
                await fetch(`http://localhost:3005/users?login=${user?.login}`)
            ).json();

            console.log(foundUser, user)
            const isValid = (
                foundUser?.login === user?.login 
                && foundUser?.password === user?.password
            );

            if (isValid) {
                setUser({ ...foundUser });
                setAuthenticated(true);
            } else {
                setError(true);
            }
        }

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
                                                    value={user?.login}
                                                    onChange={handleChange("login")}
                                                    error={error}
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
                                                    value={user?.password}
                                                    onChange={handleChange("password")}
                                                    error={error}
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
            {authenticated && <Redirect to="/notes" />}
        </Container>
    );
}