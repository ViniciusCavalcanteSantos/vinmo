import React, {useEffect, useState} from 'react';
import {Col, DatePicker, Form, Modal, Row, Select, TimePicker,} from 'antd';
import {useT} from "@/i18n/client";
import {ApiStatus} from "@/types/ApiResponse";
import {useNotification} from "@/contexts/NotificationContext";
import EventType from "@/types/EventType";
import {useEvents} from "@/contexts/EventsContext";
import ContractType from "@/types/ContractType";
import {fetchContracts} from "@/lib/database/Contract";
import {fetchEventTypes} from "@/lib/database/Event";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

interface ManageEventModalProps {
  open: boolean;
  event?: EventType;
  onCreate: (values: EventType) => void;
  onEdit: (values: EventType) => void;
  onCancel: () => void;
}

const ManageEventModal: React.FC<ManageEventModalProps> = ({open, event, onCreate, onEdit, onCancel}) => {
  const {t} = useT();
  const notification = useNotification();
  const {createEvent, updateEvent} = useEvents();

  const isEditMode = !!event;

  const [form] = Form.useForm();

  // Estados para os dados de localização
  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [eventTypes, setEventTypes] = useState<{ id: number, name: string }[]>([]);

  useEffect(() => {
    if (open) {
      (async () => {
        // TODO: implementar pesquisa de contratos
        const res = await fetchContracts(1, 300)
        if (res.status === ApiStatus.SUCCESS) {
          setContracts(res.contracts)
        }
      })()
    }
  }, [open]);

  useEffect(() => {
    const populateFields = async () => {
      if (isEditMode && event) {
        form.setFieldsValue({
          contract: event.contractId,
          event_date: dayjs(event.eventDate),
          event_start_time: event.startTime ? dayjs(event.startTime, "HH:mm") : null,
          description: event.description,
        });

        await handleContractChange(event.contractId);
        form.setFieldsValue({
          event_type: event.type.id,
        })
      } else {
        handleClean();
      }
    };

    if (open) {
      populateFields();
    }
  }, [open, event, contracts, form, isEditMode]);

  const handleContractChange = async (contractId: number) => {
    setEventTypes([]);
    form.setFieldsValue({
      event_type: undefined
    });
    const res = await fetchEventTypes(contractId);
    if (res.status === ApiStatus.SUCCESS) {
      setEventTypes(res.eventTypes);
    }
  };

  const handleClean = () => {
    form.resetFields();
    setEventTypes([]);
  }

  const handleCancel = () => {
    handleClean();
    onCancel();
  }

  const handleOk = () => {
    form.validateFields()
      .then(async (values) => {
        values.event_date = values.event_date.format("YYYY-MM-DD");
        if (values.event_start_time) {
          values.event_start_time = values.event_start_time.format('HH:mm');
        }
        let res;
        if (isEditMode) {
          res = await updateEvent(event.id, values);
        } else {
          res = await createEvent(values);
        }

        if (res.status !== ApiStatus.SUCCESS) {
          notification.warning({
            message: res.message
          })
          return;
        } else {
          notification.success({
            message: res.message
          })
        }

        handleClean();
        if (isEditMode) {
          onEdit(res.event)
        } else {
          onCreate(res.event);
        }
      })
      .catch(() => {
      });
  }

  return (
    <Modal
      open={open}
      title={isEditMode ? t('edit_event') : t('create_new_event')}
      okText={t('save_event')}
      cancelText={t('cancel')}
      width={800}
      onCancel={handleCancel}
      onOk={handleOk}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" name="form_in_modal" preserve={false}>
        {/* CAMPOS COMUNS */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="contract" label={t('contract')}
                       rules={[{required: true, message: t('select_contract') + "!"}]}>
              <Select placeholder={t('select_contract')}
                      onChange={handleContractChange}
                      options={contracts.map(contract => {
                        return {value: contract.id, label: `${contract.code} - ${contract.title}`};
                      })}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="event_type" label={t('event')}
                       rules={[{required: true, message: t('select_event')}]}>

              <Select placeholder={t('select_event')}
                      disabled={eventTypes.length === 0}
                      options={eventTypes.map(eventType => {
                        return {value: eventType.id, label: eventType.name};
                      })}/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="event_date" label={t('event_date')} rules={[{required: true, message: t('enter_date')}]}>
              <DatePicker
                picker="date"
                style={{width: '100%'}}/>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="event_start_time" label={t('event_hour_optional')} rules={[]}>
              <TimePicker style={{width: '100%'}} format="HH:mm"/>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label={t('description_optional')} rules={[]}>
          <TextArea placeholder={t('description')}/>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default ManageEventModal;