import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    NativeSelect,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import classes from "./../common/AppShellSpine.module.css";
import { useState } from "react";
import { useDisclosure, useFetch } from "@mantine/hooks";
import type { GenericResponse } from "../types";

export interface School {
    name: string,
    registerUri: string,
    clientId: string
}

export default function AuthWidget() {
    const { data, error, loading } = useFetch<GenericResponse<School[]>>("http://localhost:80/api/schools");
    const [selectedOption, setSelectedOption] = useState("");

    function handleAuth() {

    }

    return (
        <Container
            size={420}
            my={40}
            component="form"
            onSubmit={(e) => {
                e.preventDefault();
                handleAuth();
            }}>
            <Title ta="center" className={classes.title}>
                Login
            </Title>

            <Paper withBorder shadow="sm" p={22} mt="md" radius="md">
                <NativeSelect
                    error={error ? error.message : undefined}
                    label="Select your school"
                    data={data?.result ? data.result.map((school) => {
                        return {
                            label: school.name,
                            value: school.registerUri + "?client_id=" + school.clientId
                        }
                    }) : undefined}
                    required
                    onChange={(e) => { setSelectedOption(e.target.value) }}
                >

                </NativeSelect>
                <Button fullWidth mt="md" radius="md" type="submit" disabled={loading || !selectedOption || selectedOption === ""}>
                    Login
                </Button>
            </Paper>
        </Container >
    );
}
