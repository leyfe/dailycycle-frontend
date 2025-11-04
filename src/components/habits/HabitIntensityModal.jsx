import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Slider,
  Input,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { api } from "../index";

export default function HabitIntensityModal({ habit, isOpen, onClose }) {
  const [intensity, setIntensity] = useState(5);
  const [duration, setDuration] = useState("");

  const saveSession = async () => {
    try {
      const res = await api("?type=habit_session", {
        method: "POST",
        body: JSON.stringify({
          habit_id: habit.id,
          intensity,
          duration: Number(duration),
          date: new Date().toISOString().slice(0, 10),
        }),
      });
      console.log("✅ Session gespeichert:", res);
      toast.success("Training gespeichert ✅");
      onClose();
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      toast.error("Fehler beim Speichern der Session");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="font-semibold">
              {habit?.name || "Training"} abgeschlossen 🎯
            </ModalHeader>

            <ModalBody className="space-y-6">
              <div>
                <label className="block text-sm mb-1 font-medium">
                  Intensität (0–10)
                </label>
                <Slider
                  size="md"
                  minValue={0}
                  maxValue={10}
                  step={1}
                  value={intensity}
                  onChange={setIntensity}
                  color="primary"
                  aria-label="Intensität"
                  className="mt-2"
                />
                <div className="text-sm text-center mt-1 opacity-70">
                  {intensity}/10
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Dauer (Minuten)
                </label>
                <Input
                  type="number"
                  min={1}
                  placeholder="z. B. 45"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="bordered" onPress={onClose}>
                Abbrechen
              </Button>
              <Button color="primary" onPress={saveSession}>
                Speichern
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}