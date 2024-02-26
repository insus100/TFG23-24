import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Input, Link} from "@nextui-org/react";

export default function EventModal() {

    return (
    <>
      {/*<Button onPress={onOpen} color="primary">Open Modal</Button>*/}
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear evento</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Título"
                  name="title"
                  placeholder="Título del evento"
                  variant="bordered"
                />
                <Input
                  label="Fecha inicio"
                  name="start"
                  placeholder="Enter your password"
                  type="datetime-local"
                  variant="bordered"
                />
                <Input
                  label="Fecha fin"
                  name="end"
                  placeholder="Enter your password"
                  type="datetime-local"
                  variant="bordered"
                />
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Remember me
                  </Checkbox>
                  <Link color="primary" href="#" size="sm">
                    Forgot password?
                  </Link>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={onClose}>
                  Crear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
    </>
  );
}