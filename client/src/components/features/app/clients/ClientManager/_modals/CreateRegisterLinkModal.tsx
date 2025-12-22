import {useT} from "@/i18n/client";
import {useState} from "react";
import {Button, Checkbox, Divider, Form, Input, InputNumber, Modal, Row, Space, Tooltip} from "antd";
import {useNotification} from "@/contexts/NotificationContext";
import {createLink} from "@/lib/api/links/createLink";
import EventSelector from "@/components/common/EventSelector";
import {CopyOutlined} from "@ant-design/icons";

interface CreateRegisterLinkModalProps {
  open: boolean,
  handleClose: () => void,
}

export default function CreateRegisterLinkModal({open, handleClose}: CreateRegisterLinkModalProps) {
  const {t} = useT()

  const [loading, setLoading] = useState(false);
  const [openGenerated, setOpenGenerated] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('')

  const [form] = Form.useForm();
  const autoAssign = Form.useWatch('auto_assign', form);

  const [assignments, setAssignments] = useState<number[]>([]);

  const notification = useNotification();

  const handleOk = async () => {
    form.validateFields()
      .then(async (values) => {
        setLoading(true)

        values.assignments = assignments

        const res = await createLink(values)
        if (res.link_id) {
          const link = process.env.NEXT_PUBLIC_APP_URL + `/client/register/${res.link_id}`
          handleClose()
          setGeneratedLink(link)
          setOpenGenerated(true)
        }
      })
      .finally(() => setLoading(false))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink)
      .then(() => {
        notification.success({title: t('link_copied_to_clipboard')})
      })
      .catch(() => {
      })
  }

  const close = () => {
    form.resetFields()
    setLoading(false)
    setAssignments([])
    handleClose()
  }


  return (
    <>
      <Modal
        open={open}
        title={t('share_register_link')}
        okText={t('generate')}
        onCancel={close}
        onOk={handleOk}
        confirmLoading={loading}
        maskClosable={!loading}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" name="form_in_modal_generate_link">
          <Form.Item
            name="title"
            label={t('title')}
            style={{marginBottom: 10, marginRight: 10}}
            rules={[{required: true, message: t('enter_title')}]}
          >
            <Input placeholder={t('enter_title')}/>
          </Form.Item>

          <Form.Item
            name="max_registers" label={t('max_registers')}
            rules={[{required: true, message: t('enter_max_registers')}]}>
            <InputNumber placeholder={t('enter_max_registers')} min={1} max={999} maxLength={3} className="!w-full"/>
          </Form.Item>

          <Row gutter={[12, 8]}>
            <Form.Item
              name="require_address"
              valuePropName="checked"
              initialValue={false}
              style={{marginBottom: 10, marginRight: 10}}
            >
              <Checkbox>{t('require_address')}</Checkbox>
            </Form.Item>
            <Form.Item
              name="require_guardian_if_minor"
              valuePropName="checked"
              initialValue={false}
              style={{marginBottom: 10, marginRight: 10}}
            >
              <Checkbox>{t('require_guardian_if_minor')}</Checkbox>
            </Form.Item>

            {<Form.Item
              name="auto_assign"
              valuePropName="checked"
              initialValue={false}
              style={{marginBottom: 10}}
            >
              <Checkbox>{t('auto_assign')}</Checkbox>
            </Form.Item>}
          </Row>

          {autoAssign && (
            <>
              <Divider>{t('assign_client_to_event')}</Divider>

              <EventSelector value={assignments} onChange={(values) => setAssignments(values)}/>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        open={openGenerated}
        title={t('copy_register_link')}
        okText={t('finish')}
        onOk={() => setOpenGenerated(false)}
        onCancel={() => setOpenGenerated(false)}
        cancelButtonProps={{style: {display: 'none'}}}
        destroyOnHidden
      >
        {generatedLink &&
            <Form.Item
                layout="vertical"
                label={t("generated_link_label")}>
                <Space.Compact className="w-full">
                    <Input
                        placeholder={t("no_link_generated")}
                        value={generatedLink}
                        readOnly
                        style={{width: 'calc(100% - 50px)'}}
                    />
                    <Tooltip
                        title={generatedLink ? t("copy_link") : t("generate_first")}>

                        <Button
                            style={{width: 50}}
                            icon={<CopyOutlined/>}
                            onClick={handleCopy}
                            disabled={!generatedLink}
                            aria-label={t("copy_link")}

                        />
                    </Tooltip>
                </Space.Compact>
            </Form.Item>
        }
      </Modal>
    </>
  )
}

