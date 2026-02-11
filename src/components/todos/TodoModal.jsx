// src/components/todos/TodoModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  DatePicker,
} from "@nextui-org/react";

export default function TodoModal({
  isOpen,
  onOpenChange,
  onSave,
  initialTodo,
}) {
  const [form, setForm] = useState({
    id: null,
    name: "",
    due_date: null,
    done: false,
    createdAt: null,
    done_at: null,
  });

  // Wenn bestehendes Todo übergeben wird → Formular füllen
  useEffect(() => {
    if (initialTodo) {
      setForm({
        id: initialTodo.id ?? null,
        name: initialTodo.name ?? "",
        due_date: initialTodo.due_date ?? null,
        done: initialTodo.done ?? false,
        createdAt: initialTodo.createdAt ?? null,
        done_at: initialTodo.done_at ?? null,
      });
    } else {
      setForm({
        id: null,
        name: "",
        due_date: null,
        done: false,
        createdAt: null,
        done_at: null,
      });
    }
  }, [initialTodo]);

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    const isNew = !form.id;

    const payload = {
      ...form,
      // ID NICHT setzen!
      createdAt: isNew
        ? new Date().toISOString()
        : form.createdAt, // beim Edit beibehalten
    };

    onSave(payload);
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {form.id != null ? "Aufgabe bearbeiten" : "Neue Aufgabe"}
            </ModalHeader>
            <ModalBody>
              <Input
                label="Aufgabe"
                value={form.name}
                onValueChange={(v) => handleChange("name", v)}
                placeholder="z. B. Arzttermin, E-Mail schreiben, ..."
                autoFocus
              />
              <Input
                type="date"
                label="Fällig am"
                value={form.due_date || ""}
                onChange={(e) => handleChange("due_date", e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Abbrechen
              </Button>
              <Button color="primary" onPress={handleSave}>
                Speichern
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}