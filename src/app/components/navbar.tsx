"use client"

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MyNavbar({ users, events, setSelectedEvent, onInfoModalOpen, setSelectedUser, onUserModalOpen, onListCreatedEventsModalOpen, onListAttendingEventsModalOpen, onListFavoriteEventsModalOpen, onListFollowersModalOpen, onListRecommendationsModalOpen, onEventModalOpen, page }: any) {
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


    let filteredEvents = [];
    if(page=="dashboard"){
        filteredEvents = events.filter((event: EventData) =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    
    const onEventSelectionChange = (key: any) => {
        setSelectedEvent(filteredEvents.find((e: any) => e._id == key));
        onInfoModalOpen();
    }

    const onUserSelectionChange = (key: any) => {
        setSelectedUser(users.find((u: any) => u._id == key));
        onUserModalOpen();
    }

    return (
        <>
            <Navbar isBordered>
                <NavbarContent justify="start">
                    <NavbarBrand className="mr-4">
                        <p className="hidden sm:block font-bold text-inherit" style={{ color: 'white' }}>SciEvent</p>
                    </NavbarBrand>
                    <NavbarContent className="hidden sm:flex gap-3">
                        <NavbarItem isActive>
                            <Link color={page=="dashboard" ? "secondary":"foreground"} aria-current="page" href="/dashboard">
                                Calendario
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link href="/profile" color={page=="profile" ? "secondary":"foreground"}>
                                Perfil
                            </Link>
                        </NavbarItem>
                    </NavbarContent>
                </NavbarContent>
                {page=="dashboard" && (<NavbarContent as="div" className="items-center" justify="end">
                    <Autocomplete
                        label="Buscar evento..."
                        classNames={{
                            base: "max-w-full sm:max-w-[10rem] h-10",
                        }}
                        onSelectionChange={onEventSelectionChange}
                    >
                        {filteredEvents.map((event: EventData) => (
                            <AutocompleteItem key={event._id} /*onClick={() => handleEventSelection(event)}*/ value={event.title} style={{ color: 'white' }}>
                                {event.title}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                    <Autocomplete
                        label="Buscar usuario..."
                        classNames={{
                            base: "max-w-full sm:max-w-[10rem] h-10",
                        }}
                        onSelectionChange={onUserSelectionChange}
                    >
                        {users.map((user: UserData) => (
                            <AutocompleteItem key={user._id} /*onClick={() => handleUserSelection(user)}*/ value={user.username} style={{ color: 'white' }}>
                                {user.username}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                aria-label='avatar'
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="secondary"
                                size="sm"
                                name={user ? (user.username):(null)}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat" style={{ color: 'white' }}>
                            <DropdownItem aria-label="Profile data" key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Conectado como:</p>
                                <p className="font-semibold">{user ? (user.email):(null)}</p>
                            </DropdownItem>
                            <DropdownItem key="settings" onPress={() => { irAPerfil() }}>Ir al perfil</DropdownItem>
                            <DropdownItem key="add_event" onPress={() => { onEventModalOpen() }} color='success' className='bg-green-500'>Agregar evento</DropdownItem>
                            <DropdownItem key="created_events" onPress={() => { onListCreatedEventsModalOpen() }}>Eventos creados</DropdownItem>
                            <DropdownItem key="attending_events" onPress={() => { onListAttendingEventsModalOpen() }}>Eventos a los que me he apuntado</DropdownItem>
                            <DropdownItem key="favourite_events" onPress={() => { onListFavoriteEventsModalOpen() }}>Eventos favoritos</DropdownItem>
                            <DropdownItem key="followers" onPress={() => { onListFollowersModalOpen() }}>Seguidores</DropdownItem>
                            <DropdownItem key="recomendations" onPress={() => { onListRecommendationsModalOpen() }}>Recomendaciones</DropdownItem>
                            <DropdownItem key="logout" color="danger" onClick={() => { signOut() }}>
                                Cerrar sesión
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>)}    
            </Navbar>
        </>
    );
}