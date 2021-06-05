import { AppBar, Backdrop, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, makeStyles, MenuItem, Slide, TextField, Toolbar, Tooltip, Typography } from "@material-ui/core";
import {
    AddCircle as AddCircleIcon,
    Edit as EditIcon,
    ExitToApp as ExitToAppIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    Lock as LockIcon,
    Note as NoteIcon,
    Save as SaveIcon,
    SearchRounded as SearchRoundedIcon,
} from "@material-ui/icons";
import moment from "moment";
import React, { useCallback, useContext, useLayoutEffect, useState } from "react";
import { Redirect } from "react-router";
import AuthContext from "../../contexts/AuthContext";

const getDateTimeFromNow = () => moment().format('DD/MM/YYYY HH:MM:SS');

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    backdrop: {
        zIndex: theme.zIndex.modal + 1
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function NotePage(props) {
    const classes = useStyles();

    const { authState, authDispatch } = useContext(AuthContext);
    const { login, isLoggedIn } = authState;

    const [categories, setCategories] = useState([]);
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState({
        id: null,
        title: "",
        description: "",
        category: "",
        date: null,
    });
    const [isUpdate, setIsUpdate] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [isFullScreenActive, setIsFullScreenActive] = useState(false);

    const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    useLayoutEffect(() => {
        setOpenBackdrop(true);
        fetchAllNotes();
        fetchAllCategories();
        setOpenBackdrop(false);
    }, []);

    const fetchAllNotes = async () => {
        const foundNotes = await (
            await fetch(`http://localhost:3005/notes`)
        ).json()  || [];

        setNotes([...foundNotes]);
    };

    const fetchAllCategories = async () => {
        const foundCategories = await (
            await fetch(`http://localhost:3005/categories`)
        ).json() || [];

        setCategories([...foundCategories]);
    };

    const createNote = async () => {
        const saved = await (
            await fetch(`http://localhost:3005/notes`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({
                    id: null,
                    title: "[DRAFT]",
                    description: "",
                    category: 1,
                    date: getDateTimeFromNow(),
                }),
            })
        ).json() || [];

        setCurrentNote(() => saved);
        setNotes(() => [...notes, saved]);
    };

    const deleteNote = async () => {
       await fetch(`http://localhost:3005/notes/${currentNote?.id}`, {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        });

        const deletedNoteId = currentNote?.id;

        setCurrentNote({
            id: null,
            title: "",
            description: "",
            category: "",
            date: null,
        });
        setNotes(() => [...notes.filter((note) => note.id !== deletedNoteId)]);
    };

    const selecteNoteById = (id) => {
        setCurrentNote(notes.filter(note => note.id === id)[0]);
    };

    const handleNoteChange = (prop) => ({ target: { value }}) => {
        setCurrentNote(previousNote => ({ ...previousNote, [prop]: value }));
    };

    const handleCreateNote = async (event) => {
        event.preventDefault();

        setOpenBackdrop(true);
        await createNote();
        setOpenBackdrop(false);
        setIsSelected(true);
        setIsUpdate(true);
    };

    const handleNoteItemClick = (id) => (event) => {
        event.preventDefault();
        selecteNoteById(id);
        setIsUpdate(false);
        setIsSelected(true);
    };

    const handleEdit = (event) => {
        setIsUpdate(true);
    }

    const handleLock = (event) => {
        setIsUpdate(false);
    }

    const handleSaveCurrentChanges = useCallback(async (event) => {
        event.preventDefault();

        const saveNote = async () => {
            const saved = await (
                await fetch(`http://localhost:3005/notes/${currentNote?.id}`, {
                    method: "PUT",
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({ ...currentNote }),
                })
            ).json() || [];

            fetchAllNotes();
            setCurrentNote(saved);
        };

        setOpenBackdrop(true);
        await saveNote();
        setOpenBackdrop(false);
        setIsUpdate(false);
    }, [currentNote]);

    const handleOpenFullScreen = useCallback(() => {
        setIsFullScreenActive(true);
    }, []);

    const handleCloseFullScreen = useCallback(() => {
        setIsFullScreenActive(false);
    }, []);

    const handleSaveCurrentChangesOnFullScreen = useCallback(async (event) => {
        await handleSaveCurrentChanges(event);
        handleCloseFullScreen();
    }, [handleSaveCurrentChanges, handleCloseFullScreen]);

    const handleDeleteNoteConfirmation = (id) => (event) => {
        if (event.ctrlKey && event.shiftKey) {
            selecteNoteById(id);
            setOpenConfirmDeleteDialog(true);
        }
    };

    const handleCloseConfirmDeleteDialog = (event) => {
        setOpenConfirmDeleteDialog(false);
    };

    const handleDeleteNote = async (event) => {
        handleCloseConfirmDeleteDialog(event);
        setOpenBackdrop(true);
        await deleteNote();
        setOpenBackdrop(false);
        setIsSelected(false);
    };

    const handleLogOut = (event) => {
        console.log("aa")
        authDispatch({
            type: "logOut",
        });
    }
    return (
        <>
            <Container
                maxWidth="md"
            >
                <Grid
                    item
                    container
                    justify="space-between"
                    alignItems="center"
                    style={{ paddingLeft: '1rem', paddingRight: '1.8rem' }}
                >
                    <Grid
                        item
                        container
                        justify="flex-start"
                        alignItems="center"
                        md={6}
                    >
                        <NoteIcon color="primary" />
                        <Typography style={{ marginLeft: "5px", fontWeight: "bold" }} variant="h5" color="primary">
                            Note Manager
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        container
                        md={6}
                        justify="flex-end"
                        alignItems="center"
                    >
                        <Grid item>
                            <Typography variant="h6" color="textSecondary">
                                Olá, {login}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip
                                title="Sair"
                            >
                                <IconButton
                                    color="secondary"
                                    onClick={handleLogOut}
                                >
                                    <ExitToAppIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    justify="center"
                    alignItems="flex-start"
                    style={{ marginTop: "3rem" }}
                    direction="row"
                    md={12}
                    spacing={2}
                >
                    <Grid
                        item
                        container
                        md={3}
                        xs={12}
                    >
                        <Grid
                            item
                            container
                            justify="flex-start"
                            alignItems="center"
                            xs={12}
                        >
                            <TextField
                                style={{ width: "100%" }}
                                id="text-field-search"
                                placeholder="Pesquisar"
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchRoundedIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                disabled={isUpdate}
                            />
                        </Grid>
                        <Grid
                            item
                            container
                            justify="space-between"
                            alignItems="center"
                        >
                            <Typography variant="subtitle1" style={{ paddingLeft: "0.9rem" }}>TODAS AS NOTAS</Typography>
                            <Tooltip
                                title="Criar Nota"
                            >
                                <IconButton
                                    onClick={handleCreateNote}
                                    disabled={isUpdate}
                                >
                                    <AddCircleIcon color={isUpdate ? "disabled" : "primary"} />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid
                            item
                            style={{ width: "100%" }}
                        >
                            <List dense={true} style={{ width: "100%" }}>
                                {notes.map(({ id, title, date }) => (
                                    <ListItem
                                        button
                                        key={id}
                                        id={id}
                                        style={{ width: "100%" }}
                                        onClick={handleNoteItemClick(id)}
                                        onMouseDown={handleDeleteNoteConfirmation(id)}
                                        disabled={isUpdate}
                                    >
                                        <ListItemText
                                            primary={title}
                                            secondary={date}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        container
                        md={9}
                        spacing={3}
                    >
                        <Grid
                            item
                            container
                            style={{ width: "100%" }}
                            spacing={2}
                        >
                            <Grid
                                item
                                container
                                justify="flex-start"
                                alignItems="center"
                                xs={12}
                            >
                                <TextField
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    label="Título"
                                    value={currentNote?.title}
                                    onChange={handleNoteChange("title")}
                                    disabled={!isUpdate}
                                />
                            </Grid>
                            <Grid
                                item
                                style={{ width: "100%" }}
                                xs={8}
                            >
                                <TextField
                                    select={true}
                                    style={{ width: "100%" }}
                                    id="select-category"
                                    label="Categoria"
                                    variant="outlined"
                                    size="small"
                                    value={currentNote?.category}
                                    onChange={handleNoteChange("category")}
                                    disabled={!isUpdate}
                                >
                                    {categories.map(({ id, description }) => (
                                        <MenuItem
                                            key={id}
                                            value={id}
                                            children={description}
                                        />
                                    ))}

                                </TextField>
                            </Grid>
                            <Grid
                                style={{ width: "100%" }}
                                item
                                container
                                justify={isUpdate ? "space-between" : "flex-end"}
                                alignItems="center"
                                spacing={1}
                                xs={4}
                            >
                                {isUpdate &&
                                    <Grid item xs={6}>
                                        <Tooltip
                                            title="Travar"
                                        >
                                            <Button
                                                style={{ width: "100%" }}
                                                variant="outlined"
                                                color="inherit"
                                                onClick={handleLock}
                                            >
                                                <LockIcon />
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                }
                                {isUpdate &&
                                    <Grid item xs={6}>
                                        <Tooltip
                                            title="Salvar"
                                        >
                                            <Button
                                                style={{ width: "100%" }}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSaveCurrentChanges}
                                            >
                                                <SaveIcon />
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                }
                                {isSelected && !isUpdate &&
                                    <Grid item xs={6}>
                                        <Typography variant="body2" style={{ color: "gray" }}>
                                            {currentNote?.date}
                                        </Typography>
                                    </Grid>
                                }
                                {isSelected && !isUpdate &&
                                    <Grid item xs={6}>
                                        <Button
                                            style={{ width: "100%" }}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleEdit}
                                        >
                                            <EditIcon />
                                        </Button>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                        {isUpdate &&
                            <Grid
                                item
                                xs={12}
                                style={{ width: "100%", paddingRight: "1.6rem" }}
                            >
                                <Button startIcon={<FullscreenIcon />} style={{ width: "100%" }} variant="outlined" onClick={handleOpenFullScreen}>
                                    TELA CHEIA
                                </Button>
                            </Grid>
                        }
                        <Grid
                            item
                            style={{ width: "100%", paddingRight: "1.6rem" }}
                        >
                            <TextField
                                style={{ width: "100%" }}
                                id="standard-multiline-flexible"
                                variant="outlined"
                                multiline
                                rows={30}
                                value={currentNote?.description}
                                onChange={handleNoteChange("description")}
                                disabled={!isUpdate}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            <Dialog
                fullScreen
                open={isFullScreenActive}
                onClose={handleCloseFullScreen}
                TransitionComponent={Transition}
                keepMounted
                disablePortal
            >
                <AppBar className={classes.appBar}>
                <Toolbar>
                    <Tooltip title="Sair da Tela Cheia">
                        <IconButton edge="start" color="inherit" onClick={handleCloseFullScreen} aria-label="close">
                            <FullscreenExitIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h6" className={classes.title}>
                        {currentNote.title}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleSaveCurrentChangesOnFullScreen}>
                        SALVAR
                    </Button>
                </Toolbar>
                </AppBar>
                <Grid
                    item
                    container
                    style={{ width: "100%", height: "100%" }}
                >
                    <TextField
                        id="standard-multiline-flexible"
                        fullWidth
                        style={{ width: "100%", height: "100%" }}
                        variant="outlined"
                        multiline
                        rows={30}
                        InputProps={{
                            style: {
                                height: "100%",
                                width: "100%",
                            }
                        }}
                        value={currentNote?.description}
                        onChange={handleNoteChange("description")}
                        disabled={!isUpdate}
                    />
                </Grid>
            </Dialog>
            {openConfirmDeleteDialog &&
                <Dialog
                    open={openConfirmDeleteDialog}
                    TransitionComponent={Transition}
                    onClose={handleCloseConfirmDeleteDialog}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {`Tem certeza que deseja excluir a nota "${currentNote?.title}"?`}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Ao clicar em confirmar a nota será excluída permanentemente.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmDeleteDialog} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleDeleteNote} color="secondary">
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>
            }
            <Backdrop open={openBackdrop} className={classes.backdrop}>
                <CircularProgress color="primary" />
            </Backdrop>
            {!isLoggedIn && <Redirect to="/" />}
        </>
    );
}