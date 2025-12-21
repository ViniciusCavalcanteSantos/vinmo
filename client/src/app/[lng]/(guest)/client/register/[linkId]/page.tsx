"use client";

import React, {useEffect, useState} from 'react';
import {
  AutoComplete,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Upload,
  UploadFile,
  UploadProps
} from 'antd';
import {useParams, useRouter} from 'next/navigation';
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {guardianTypes} from "@/types/Client";
import dayjs from "dayjs";
import {PlusOutlined} from "@ant-design/icons";
import InputPhone from "@/components/ui/InputPhone";
import {RegisterLinkType} from "@/types/RegisterLinkType";
import getDateFormatByCountry from "@/lib/getDateFormatByCountry";
import {CountryCode} from "libphonenumber-js";
import {useCountries} from "@/lib/queries/locations/useCountries";
import {useStates} from "@/lib/queries/locations/useStates";
import {useCities} from "@/lib/queries/locations/useCities";
import {createClientPublic} from "@/lib/api/clients/createClient";
import {fetchLink} from "@/lib/api/links/fetchLink";
import PageHeader from "@/components/common/layout/PageHeader";

const ManageClientPage: React.FC = () => {
  const {t} = useT();
  const notification = useNotification();
  const router = useRouter();
  const params = useParams();
  const linkId = params.linkId as string;

  const [linkInfo, setLinkInfo] = useState<RegisterLinkType | null>(null);
  const [requireGuardian, setRequireGuardian] = useState(false);

  const isEditMode = false;

  const [form] = Form.useForm();
  const birthdate = Form.useWatch('birthdate', form);
  const country = Form.useWatch('country', form);
  const state = Form.useWatch('state', form);

  const {data: countries, isLoading: isLoadingCountries} = useCountries()
  const {data: states, isLoading: isLoadingStates} = useStates(country)
  const {data: cities} = useCities(country, state)

  const [uploadRequired, setUploadRequired] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [loadingForm, setLoadingForm] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const loadClientData = async () => {
      setLoadingForm(true);
      await fetchLink(linkId)
        .then(res => {
          setLinkInfo(res.linkInfo);

        })
        .catch(err => {
          notification.error({title: t('link_not_found')});
          router.replace("/");
        })
        .finally(() => {
          setLoadingForm(false);
          form.resetFields();
        })
    };

    loadClientData();
  }, [isEditMode, form, router, linkId]);

  useEffect(() => {
    if (!linkInfo || !birthdate) return;

    if (linkInfo.requireGuardianIfMinor) {
      const years = dayjs().diff(dayjs(birthdate), 'years');
      if (years < 18) {
        setRequireGuardian(true);
        return;
      }
    }

    setRequireGuardian(false);
  }, [linkInfo, birthdate]);

  const handleCountryChange = () => form.setFieldsValue({state: null, city: null});
  const handleStateChange = async () => form.setFieldsValue({city: null});

  const handleSubmit = async (values: any) => {
    if (!linkInfo) return;
    if (!fileList[0]) {
      setUploadRequired(true);
      return;
    }

    setLoadingSubmit(true);
    if (values.birthdate) {
      values.birthdate = dayjs(values.birthdate).format('YYYY-MM-DD');
    }

    await createClientPublic(linkInfo?.id, values, fileList[0])
      .then(res => {
        notification.success({title: res.message});
        router.push('app/client/register/success');
      })
      .catch(err => {
        notification.warning({title: err.message})
      })
      .finally(() => {
        setLoadingSubmit(false);

      })
  }

  const handleBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      notification.warning({
        title: t('Invalid_file'),
        description: t('please_select_images_only')
      });
      return Upload.LIST_IGNORE;
    }

    return false;
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
    setUploadRequired(false)
    setFileList(newFileList);
  }

  return (
    <main className="p-6 lg:px-8 mx-auto max-w-7xl flex flex-col">
      <>
        <span className="text-2xl font-bold uppercase text-center mt-12 mb-8">{linkInfo?.title}</span>

        <PageHeader title={t('register')}/>

        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <div className="w-fit p-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-lg">
            <div className="mb-2 text-ant-text flex items-center">
          <span
            className="inline-block text-sm text-[#ff4d4f] mr-1"
            style={{fontFamily: 'SimSun, sans-serif'}}
          >*</span>
              {t('your_photo')}
            </div>
            <div className="min-h-[124px] overflow-hidden">
              <Upload
                className={`antd-upload-w-180 ${uploadRequired ? 'antd-upload-error' : ''}`}
                listType="picture-card"
                fileList={fileList}
                beforeUpload={handleBeforeUpload}
                onPreview={handlePreview}
                onChange={handleChange}
                accept="image/*"
                maxCount={1}
              >
                {fileList.length >= 1 ? null : (
                  <button style={{border: 0, background: 'none'}} type="button">
                    <PlusOutlined/>
                    <div style={{marginTop: 8}}>Upload</div>
                  </button>
                )}
              </Upload>
            </div>

            {uploadRequired &&
                <div className="text-[#ff4d4f]">
                  {t('select_a_photo')}
                </div>
            }

            {previewImage && (
              <Image
                styles={{root: {display: 'none'}}}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
          </div>

          <Card loading={loadingForm} variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-full">
            <Form form={form} layout="vertical" name="manage_client_form" onFinish={handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="name" label={t('name')} rules={[{required: true, message: t('enter_name')}]}>
                    <Input placeholder={t('name')} maxLength={60}/>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="birthdate" label={t('birthdate')}
                             rules={[{required: true, message: t('enter_birthdate')}]}>
                    <DatePicker picker="date" style={{width: '100%'}} maxDate={dayjs()}
                                format={getDateFormatByCountry(linkInfo?.defaultLanguage)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="email" label={t('email')}
                             rules={[{required: true, message: t('enter_email')}]}>
                    <Input placeholder={t('email')} maxLength={20} type="email"/>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="phone" label={t('phone')} rules={[{required: true, message: t('enter_phone')}]}>
                    <InputPhone placeholder={t('phone')} defaultCountryCode={linkInfo?.defaultLanguage as CountryCode}/>
                  </Form.Item>
                </Col>
              </Row>

              {requireGuardian && (
                <>
                  <Row gutter={16}>
                    <Divider>{t('guardian')}</Divider>

                    <Col span={16}>
                      <Form.Item name="guardian_name" label={t('guardian_name')}
                                 rules={[{required: true, message: t('enter_guardian_name')}]}>
                        <Input placeholder={t('enter_guardian_name')} maxLength={60}/>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item name="guardian_type" label={t('guardian_type')}
                                 rules={[{required: true, message: t('select_guardian_type')}]}>
                        <Select
                          placeholder={t('select_guardian_type')}
                          options={guardianTypes.map(guardianType => {
                            return {
                              value: guardianType,
                              label: t(guardianType),
                            }
                          })}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="guardian_email" label={t('guardian_email')}
                                 rules={[{required: true, message: t('enter_guardian_email'), type: 'email'}]}>
                        <Input placeholder={t('enter_guardian_email')} maxLength={60}/>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item name="guardian_phone" label={t('guardian_phone')}
                                 rules={[{required: true, message: t('enter_guardian_phone')}]}>
                        <InputPhone placeholder={t('enter_guardian_phone')} maxLength={20}/>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              {!!linkInfo?.requireAddress && (
                <>
                  <Divider>{t('address')}</Divider>

                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item name="postal_code" label={t('postal_code')}
                                 rules={[{required: true, message: t('enter_postal_code')}]}>
                        <Input placeholder={t('postal_code')} maxLength={12}/>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={16}>
                      <Form.Item name="street" label={t('street')}
                                 rules={[{required: true, message: t('enter_street')}]}>
                        <Input placeholder={t('street')} maxLength={120}/>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item name="number" label={t('number')}
                                 rules={[{required: true, message: t('enter_number')}]}>
                        <Input placeholder={t('number')} maxLength={10}/>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="neighborhood" label={t('neighborhood')}
                             rules={[{required: true, message: t('enter_neighborhood')}]}>
                    <Input placeholder={t('neighborhood')} maxLength={40}/>
                  </Form.Item>

                  {/* CAMPOS DE LOCALIZAÇÃO */}
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item name="country" label={t('country')}
                                 rules={[{required: true, message: t('select_country')}]}>
                        <Select placeholder={t('select_country')}
                                loading={isLoadingCountries}
                                onChange={handleCountryChange}
                                options={countries}
                                showSearch={{
                                  filterOption: (input, option) => (
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                  )
                                }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="state" label={t('state_province')}
                                 rules={[{required: true, message: t('select_state')}]}>
                        <Select placeholder={t('select_state')}
                                loading={isLoadingStates}
                                disabled={!country || isLoadingStates}
                                onChange={handleStateChange}
                                options={states}
                                showSearch={{
                                  filterOption: (input, option) => (
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                  )
                                }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="city" label={t('city')} rules={[{required: true, message: t('enter_city')}]}>
                        <AutoComplete placeholder={t('enter_or_select')}
                                      disabled={!state}
                                      options={cities}
                                      showSearch={{
                                        filterOption: (input, option) => (
                                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        )
                                      }}
                        >
                          <Input/>
                        </AutoComplete>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="complement" label={t('complement')}
                             rules={[{message: t('enter_complement')}]}>
                    <Input placeholder={t('complement')} maxLength={120}/>
                  </Form.Item>
                </>
              )}

              <Form.Item className="!mt-4 flex justify-end">
                <Space className="flex justify-end">
                  <Button onClick={() => router.back()}>{t('cancel')}</Button>
                  <Button type="primary" htmlType="submit" loading={loadingSubmit}>
                    {t('save_client')}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

        </div>

      </>
    </main>
  );
};

export default ManageClientPage;