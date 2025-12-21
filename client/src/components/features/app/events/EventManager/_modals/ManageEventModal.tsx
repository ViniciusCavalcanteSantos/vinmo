import React, {useEffect, useState} from 'react';
import {Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, TimePicker, Tooltip,} from 'antd';
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import Event from "@/types/Event";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import {useUser} from "@/contexts/UserContext";
import {InfoCircleOutlined} from "@ant-design/icons";
import {useCreateEvent} from "@/lib/queries/events/useCreateEvent";
import {useUpdateEvent} from "@/lib/queries/events/useUpdateEvent";
import {fetchEventTypes} from "@/lib/api/events/fetchEventTypes";
import {useContracts} from "@/lib/queries/contracts/useContracts";

interface ManageEventModalProps {
  open: boolean;
  event?: Event;
  onCreate: (values: Event) => void;
  onEdit: (values: Event) => void;
  onCancel: () => void;
}

const ManageEventModal: React.FC<ManageEventModalProps> = ({open, event, onCreate, onEdit, onCancel}) => {
  const {t} = useT();
  const notification = useNotification();
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const {defaultDateFormat} = useUser();

  const isEditMode = !!event;

  const [form] = Form.useForm();

  // TODO: implementar pesquisa de contratos
  const {data: contracts} = useContracts(undefined, 1, 300)
  const [eventTypes, setEventTypes] = useState<{ id: number, name: string }[]>([]);

  useEffect(() => {
    const populateFields = async () => {
      if (isEditMode && event) {
        form.setFieldsValue({
          contract: event.contractId,
          title: event.title,
          event_date: dayjs(event.eventDate),
          event_start_time: event.startTime ? dayjs(event.startTime, "HH:mm") : null,
          description: event.description,
          auto_assign_clients: event.autoAssignClients
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
    // TODO: Implementar o useEventTypes
    await fetchEventTypes(contractId)
      .then(res => {
        setEventTypes(res.eventTypes);
      })
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

        if (isEditMode) {
          updateEvent.mutate({id: event.id, values: values}, {
            onSuccess: (res) => {
              notification.success({
                title: res.message
              })
              onEdit(res.event)
            }
          })
        } else {
          createEvent.mutate(values, {
            onSuccess: (res) => {
              notification.success({
                title: res.message
              })
              onCreate(res.event)
            }
          });
        }

        handleClean();
      })
      .catch((err: any) => {
        notification.warning({title: err.message});
      });
  }

  return (
    <Modal
      open={open}
      title={isEditMode ? t('edit_event') : t('create_new_event')}
      okText={t('save_event')}
      cancelText={t('cancel')}
      onCancel={handleCancel}
      onOk={handleOk}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        {/* CAMPOS COMUNS */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="contract" label={t('contract')}
                       rules={[{required: true, message: t('select_contract') + "!"}]}>
              <Select placeholder={t('select_contract')}
                      onChange={handleContractChange}
                      options={contracts?.map(contract => {
                        return {value: contract.id, label: `${contract.code} - ${contract.title}`};
                      })}/>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
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

        <Form.Item name="title" label={t('event_title')} rules={[{required: true, message: t('enter_title')}]}>
          <Input placeholder={t('event_title_ex')}/>
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="event_date" label={t('event_date')} rules={[{required: true, message: t('enter_date')}]}>
              <DatePicker
                picker="date"
                style={{width: '100%'}}
                format={defaultDateFormat}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="event_start_time" label={t('event_hour_optional')} rules={[]}>
              <TimePicker style={{width: '100%'}} format="HH:mm"/>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description" label={t('description_optional')} rules={[]} className="!mb-2">
          <TextArea placeholder={t('description')}/>
        </Form.Item>

        <Form.Item
          name="auto_assign_clients"
          valuePropName="checked"
          initialValue={false}
          style={{marginBottom: 10}}
        >
          <Checkbox>
            {t('auto_assign_clients_to_event')}&nbsp;
            <Tooltip title={t('auto_assign_clients_to_event_explanation')}>
              <InfoCircleOutlined className="!text-ant-primary"/>
            </Tooltip>
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ManageEventModal;