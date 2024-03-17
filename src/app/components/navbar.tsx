"use client"

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MyNavbar({ events, setSelectedEvent, onInfoModalOpen }: any) {
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
    return (
        <>
            <Navbar isBordered>
                <NavbarContent justify="start">
                    <NavbarBrand className="mr-4">
                        <p className="hidden sm:block font-bold text-inherit">SciEvent</p>
                    </NavbarBrand>
                    <NavbarContent className="hidden sm:flex gap-3">
                        <NavbarItem>
                            <Link color="foreground" href="#">
                                Features
                            </Link>
                        </NavbarItem>
                        <NavbarItem isActive>
                            <Link href="#" aria-current="page" color="secondary">
                                Customers
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="#">
                                Integrations
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
                            <AutocompleteItem key={event._id} onClick={() => handleEventSelection(event)} value={event.title}>
                                {event.title}
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
                                name="Jason Hughes"
                                size="sm"
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Conectado como:</p>
                                <p className="font-semibold">{user.email}</p>
                            </DropdownItem>
                            <DropdownItem key="settings" onPress={() => { irAPerfil() }}>Ir al perfil</DropdownItem>
                            <DropdownItem key="team_settings">Team Settings</DropdownItem>
                            <DropdownItem key="analytics">Analytics</DropdownItem>
                            <DropdownItem key="system">System</DropdownItem>
                            <DropdownItem key="configurations">Configurations</DropdownItem>
                            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                            <DropdownItem key="logout" color="danger" onClick={() => { signOut() }}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            </Navbar>
        </>
    );
}