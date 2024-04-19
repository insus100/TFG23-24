"use client"

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MyNavbar({ users, events, setSelectedEvent, onInfoModalOpen, setSelectedUser, onUserModalOpen, onListCreatedEventsModalOpen, onListAttendingEventsModalOpen, onListFavoriteEventsModalOpen, onListFollowersModalOpen, onListRecommendationsModalOpen, onEventModalOpen }: any) {
    const { data: session, status } = useSession()
    const user = session?.user as any;
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    interface EventData {
        _id: string;
        title: string;
        start: Date;
        end: Date;
        creator: any
        attendingUsers: []
    }

    interface UserData {
        _id: string;
        username: string;
        email: string;
    }

    const irAPerfil = () => {
        return router.push('/profile')
    };


    const filteredEvents = events.filter((event: EventData) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEventSelection = (selectedEvent: EventData) => {
        setSelectedEvent(selectedEvent);
        onInfoModalOpen();
    };

    const handleUserSelection = (selectedUser: UserData) => {
        setSelectedUser(selectedUser);
        onUserModalOpen();
    };

    return (
        <>
            <Navbar isBordered>
                <NavbarContent justify="start">
                    <NavbarBrand className="mr-4">
                        <p className="hidden sm:block font-bold text-inherit" style={{ color: 'white' }}>SciEvent</p>
                    </NavbarBrand>
                    <NavbarContent className="hidden sm:flex gap-3">
                        <NavbarItem isActive>
                            <Link color="secondary" aria-current="page" href="#">
                                Calendario
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link href="/users" color="foreground">
                                Usuarios
                            </Link>
                        </NavbarItem>
                    </NavbarContent>
                </NavbarContent>

                <NavbarContent as="div" className="items-center" justify="end">
                    <Autocomplete
                        label="Buscar evento..."
                        classNames={{
                            base: "max-w-full sm:max-w-[10rem] h-10",
                        }}
                    >
                        {filteredEvents.map((event: EventData) => (
                            <AutocompleteItem key={event._id} onClick={() => handleEventSelection(event)} value={event.title} style={{ color: 'white' }}>
                                {event.title}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                    <Autocomplete
                        label="Buscar usuario..."
                        classNames={{
                            base: "max-w-full sm:max-w-[10rem] h-10",
                        }}
                    >
                        {users.map((user: UserData) => (
                            <AutocompleteItem key={user._id} onClick={() => handleUserSelection(user)} value={user.username} style={{ color: 'white' }}>
                                {user.username}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="secondary"
                                size="sm"
                                name={user ? (user.username):(null)}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat" style={{ color: 'white' }}>
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Conectado como:</p>
                                <p className="font-semibold">{user ? (user.email):(null)}</p>
                            </DropdownItem>
                            <DropdownItem key="settings" onPress={() => { irAPerfil() }}>Ir al perfil</DropdownItem>
                            <DropdownItem key="add_event" onPress={() => { onEventModalOpen() }} color='success' className='bg-green-500'>Agregar evento</DropdownItem>
                            <DropdownItem key="created_events" onPress={() => { onListCreatedEventsModalOpen() }}>Ver eventos creados</DropdownItem>
                            <DropdownItem key="attending_events" onPress={() => { onListAttendingEventsModalOpen() }}>Ver eventos a los que me he apuntado</DropdownItem>
                            <DropdownItem key="favourite_events" onPress={() => { onListFavoriteEventsModalOpen() }}>Ver eventos favoritos</DropdownItem>
                            <DropdownItem key="followers" onPress={() => { onListFollowersModalOpen() }}>Ver seguidores</DropdownItem>
                            <DropdownItem key="recomendations" onPress={() => { onListRecommendationsModalOpen() }}>Ver recomendaciones</DropdownItem>
                            <DropdownItem key="logout" color="danger" onClick={() => { signOut() }}>
                                Cerrar sesión
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            </Navbar>
        </>
    );
}