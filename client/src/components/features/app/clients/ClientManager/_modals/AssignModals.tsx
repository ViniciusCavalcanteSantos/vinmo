import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useEffect, useState} from "react";
import {assignClient} from "@/lib/api/assignments/assignClient";
import {assignClientBulk} from "@/lib/api/assignments/assignClientBulk";
import {unassignClientBulk} from "@/lib/api/assignments/unassignClientBulk";
import {Modal} from "antd";
import EventSelector from "@/components/common/EventSelector";

interface AssignModalsProps {
  openModalAssign: boolean,
  handleClose: () => void,
  clientIds: number[],
  initialAssignments: number[],
  type: "single" | "bulk" | 'unassign'
}

export default function AssignModals(
  {
    openModalAssign,
    handleClose,
    clientIds,
    type,
    initialAssignments = []
  }: AssignModalsProps) {
  const {t} = useT();
  const notification = useNotification();

  const [assignments, setAssignments] = useState<number[]>([]);

  useEffect(() => {
    setAssignments(initialAssignments)
  }, [initialAssignments]);

  const handleAssignChange = (values: number[]) => {
    setAssignments(values);
  }

  const handleAssign = async () => {
    if (!clientIds.length) return;

    try {
      let res;
      if (type === "single") {
        res = await assignClient(clientIds[0], assignments)
      } else if (type === "bulk") {
        res = await assignClientBulk(clientIds, assignments)
      } else {
        res = await unassignClientBulk(clientIds, assignments)
      }
      notification.success({title: res.message})
      handleClose()
    } catch (err: any) {
      notification.warning({title: err.message})
    }
  }

  let title;
  let okText;
  if (type === "single") {
    title = 'assign_client_to_event'
    okText = 'assign'
  } else if (type === "bulk") {
    title = 'assign_clients_to_events'
    okText = 'assign'
  } else {
    title = 'unassign_clients'
    okText = 'unassign'
  }

  return (
    <>
      <Modal
        open={openModalAssign}
        title={t(title)}
        okText={t(okText)}
        onCancel={handleClose}
        onOk={handleAssign}
        okButtonProps={{color: type === 'unassign' ? 'gold' : 'primary', variant: "solid"}}
      >
        <EventSelector value={assignments} onChange={handleAssignChange}/>
      </Modal>
    </>
  )
}
