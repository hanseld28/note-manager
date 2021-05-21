import { Backdrop, CircularProgress, Container, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, MenuItem, TextField, Typography } from "@material-ui/core";
import { 
    AddCircle as AddCircleIcon, 
    SearchRounded as SearchRoundedIcon,
} from "@material-ui/icons";
import moment from "moment";
import React, { useLayoutEffect, useState } from "react";

const getDateTimeFromNow = () => moment().format('DD/MM/YYYY HH:MM:SS');

export default function NotePage(props) {
    const [categories, setCategories] = useState([]);
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState({
        id: null,
        title: "",
        description: "",
        category: 1,
        date: null,
    });

    const [isCreate, setIsCreate] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

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

    const saveNote = async () => {
        console.log(currentNote)
        const saved = await (
            await fetch(`http://localhost:3005/notes`, {
                method: "POST",
                body: { ...currentNote }
            })
        ).json() || [];

        setNotes([...notes, saved]);
        setCurrentNote(saved);
    };

    const handleCreateNote = async (event) => {
        event.preventDefault();
        setOpenBackdrop(true);

        setCurrentNote({
            id: null,
            title: "[DRAFT] Nota",
            description: "",
            category: 1,
            date: getDateTimeFromNow(),
        });

        setOpenBackdrop(false);
        setIsCreate(true);
        saveNote();
    }

    return (
        <>
            <Container
                maxWidth="md"
            >
                <Grid
                    container
                    justify="center"
                    alignItems="flex-start"
                    style={{ marginTop: "5rem" }}
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
                            />
                        </Grid>
                        <Grid
                            item
                            container
                            justify="space-between"
                            alignItems="center"
                        >
                            <Typography variant="subtitle1" style={{ paddingLeft: "0.9rem" }}>TODAS AS NOTAS</Typography>
                            <IconButton
                                children={<AddCircleIcon />}
                                onClick={handleCreateNote}
                            />
                        </Grid>
                        <Grid
                            item
                            style={{ width: "100%" }}
                        >
                            <List dense={true} style={{ width: "100%" }}>
                                {notes.map(({ id, title, date }) => (
                                    <ListItem
                                        key={id}
                                        id={id}
                                        style={{ width: "100%" }}
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
                                    value={currentNote.title}
                                    disabled={!isCreate && !isUpdate}
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
                                    value={currentNote.category}
                                    disabled={!isCreate && !isUpdate}
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
                                justify="flex-end"
                                alignItems="center"
                                xs={4}
                            >
                                <Typography variant={!isCreate && !isUpdate ? "srOnly" : "subtitle2"} >
                                    {currentNote.date}
                                </Typography>
                            </Grid>
                        </Grid>
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
                                value={currentNote.description}
                                disabled={!isCreate && !isUpdate}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            <Backdrop open={openBackdrop}>
                <CircularProgress color="primary" />
            </Backdrop>
        </>
    );
}