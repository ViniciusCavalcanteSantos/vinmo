import {useState} from "react";
import Client from "@/types/Client";

export type AssignType = "single" | "bulk" | "unassign";

export function useAssignController() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<AssignType>("single");
  const [clientIds, setClientIds] = useState<number[]>([]);

  const [targetSingleId, setTargetSingleId] = useState<number | undefined>();

  const openSingle = (client: Client) => {
    setType("single");
    setClientIds([client.id]);
    setTargetSingleId(client.id);
    setIsOpen(true);
  };

  const openBulk = (ids: number[]) => {
    setType("bulk");
    setClientIds(ids);
    setTargetSingleId(undefined);
    setIsOpen(true);
  };

  const openUnassign = (ids: number[]) => {
    setType("unassign");
    setClientIds(ids);
    setTargetSingleId(undefined);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setClientIds([]);
    setTargetSingleId(undefined);
  };

  return {
    state: {isOpen, type, clientIds, targetSingleId},
    actions: {openSingle, openBulk, openUnassign, close}
  };
}