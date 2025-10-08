"use client";

import React, {useEffect, useState} from 'react';
import {
  AutoComplete,
  Button,
  Card,
  Checkbox,
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
import {getCities, getCountries, getStates} from "@/lib/database/Location";
import {useT} from "@/i18n/client";
import {ApiStatus} from "@/types/ApiResponse";
import {useNotification} from "@/contexts/NotificationContext";
import ClientType, {guardianTypes} from "@/types/ClientType";
import dayjs from "dayjs";
import PageHeader from "@/components/PageHeader";
import {PlusOutlined} from "@ant-design/icons";
import {createClient, fetchClient, updateClient} from "@/lib/database/Client";

interface OptionType {
  value: string;
  label: string;
}

const ManageClientPage: React.FC = () => {
  const {t} = useT();
  const notification = useNotification();
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const isEditMode = clientId !== 'new';

  const [form] = Form.useForm();
  const informAddress = Form.useWatch('inform_address', form);
  const informGuardian = Form.useWatch('inform_guardian', form);
  const keepAdding = Form.useWatch('keep_adding', form);
  const country = Form.useWatch('country', form);
  const state = Form.useWatch('state', form);

  const [countries, setCountries] = useState<OptionType[]>([]);
  const [states, setStates] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);

  const [uploadRequired, setUploadRequired] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [_, setLoadingCities] = useState(false);

  const [loadingForm, setLoadingForm] = useState(isEditMode);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    setLoadingCountries(true);
    getCountries()
      .then(data => {
        setCountries(data.countries);
      })
      .finally(() => setLoadingCountries(false));
  }, []);

  useEffect(() => {
    const loadClientData = async () => {
      if (isEditMode && clientId) {
        setLoadingForm(true);
        const res = await fetchClient(Number(clientId));
        if (res.status === ApiStatus.SUCCESS && res.client) {
          const clientData = res.client;
          form.setFieldsValue({
            ...clientData,
            guardian_name: clientData.guardian?.name,
            guardian_type: clientData.guardian?.type,
            guardian_phone: clientData.guardian?.phone,
            guardian_email: clientData.guardian?.email,
            // postal_code: clientData.address.postal_code,
            street: clientData.address?.street,
            number: clientData.address?.number,
            neighborhood: clientData.address?.neighborhood,
            complement: clientData.address?.complement,
            country: clientData.address?.country,
            state: clientData.address?.state,
            city: clientData.address?.city,
            inform_address: !!clientData.address,
            inform_guardian: !!clientData.guardian?.name,
            birthdate: clientData.birthdate ? dayjs(clientData.birthdate) : null,
          });
          if (clientData.address) {
            try {
              const {country, state} = clientData.address;
              setLoadingStates(true);
              setLoadingCities(true);
              const [statesRes, citiesRes] = await Promise.all([
                getStates(country),
                getCities(country, state)
              ]);

              if (statesRes.status !== ApiStatus.SUCCESS || citiesRes.status !== ApiStatus.SUCCESS) {
                return notification.warning({message: 'Falha ao carregar o endereço!'});
              }

              setStates(statesRes.states)
              setCities(citiesRes.cities)
            } catch (err) {
            } finally {
              setLoadingCountries(false);
              setLoadingCities(false);
            }
          }

          setFileList([
            {
              uid: '-1',
              name: 'profile.jpg',
              status: 'done',
              url: clientData.profileUrl,
            },
          ]);
        } else {
          notification.error({message: 'Cliente não encontrado.'});
          router.back();
        }
        setLoadingForm(false);
      } else {
        form.resetFields();
      }
    };

    loadClientData();
  }, [clientId, isEditMode, form, router]);


  useEffect(() => {
    if (!informAddress) {
      form.setFieldsValue({
        postal_code: undefined, street: undefined, number: undefined, neighborhood: undefined,
        country: undefined, state: undefined, city: undefined, complement: undefined,
      });
    }

    if (!informGuardian) {
      form.setFieldsValue({
        guardian_name: undefined, guardian_type: undefined,
        guardian_email: undefined, guardian_phone: undefined,
      });
    }
  }, [informAddress, informGuardian])

  const handleCountryChange = (countryCode: string) => {
    form.setFieldsValue({state: null, city: null});
    setStates([]);
    setCities([]);
    if (countryCode) {
      setLoadingStates(true);
      getStates(countryCode)
        .then(res => setStates(res.states))
        .finally(() => setLoadingStates(false));
    }
  };

  // ALTERAÇÃO: Pequena modificação para aceitar o countryCode como parâmetro
  const handleStateChange = async (stateCode: string) => {
    form.setFieldsValue({city: null});
    setCities([]);
    const countryCode = form.getFieldValue('country');
    if (stateCode && countryCode) {
      setLoadingCities(true);
      getCities(countryCode, stateCode)
        .then(data => setCities(data.cities))
        .finally(() => setLoadingCities(false));
    }
  };

  const handleSubmit = async (values: ClientType) => {
    if (!fileList[0]) {
      setUploadRequired(true);
      return;
    }

    setLoadingSubmit(true);
    if (values.birthdate) {
      values.birthdate = dayjs(values.birthdate).format('YYYY-MM-DD');
    }

    let res;
    if (isEditMode) {
      res = await updateClient(Number(clientId), values, fileList[0]);
    } else {
      res = await createClient(values, fileList[0]);
    }

    setLoadingSubmit(false);

    if (res.status !== ApiStatus.SUCCESS) {
      return notification.warning({message: res.message});
    }

    notification.success({message: res.message});
    if (!isEditMode) {
      if (keepAdding) {
        setFileList([])
        form.resetFields();
        form.setFieldsValue({inform_address: informAddress});
        form.setFieldsValue({inform_guardian: informGuardian});
        form.setFieldsValue({keep_adding: keepAdding});
      } else {
        router.push('/clients');
      }
    }
  }

  const handleBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      notification.warning({
        message: 'Arquivo inválido!',
        description: 'Por favor, selecione apenas arquivos do tipo imagem!'
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
    setFileList(newFileList);
  }

  return (
    <>
      <PageHeader title={isEditMode ? t('edit_client') : t('create_new_client')}/>

      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <div className="w-fit p-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-lg">
          <div className="mb-2 text-dark flex items-center">
          <span
            className="inline-block text-sm text-[#ff4d4f] mr-1"
            style={{fontFamily: 'SimSun, sans-serif'}}
          >*</span>
            Foto do cliente
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
              wrapperStyle={{display: 'none'}}
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
                <Form.Item name="code" label={t('code')}
                           rules={[{message: t('enter_code')}]}>
                  <Input placeholder={t('code')} maxLength={20}/>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="birthdate" label={t('birthdate')} rules={[]}>
                  <DatePicker picker="date" style={{width: '100%'}} maxDate={dayjs()}/>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="phone" label={t('phone')} rules={[]}>
                  <Input placeholder={t('phone')} maxLength={20}/>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Form.Item
                name="inform_address"
                valuePropName="checked"
                initialValue={false}
                style={{marginBottom: 10, marginRight: 10}}
              >
                <Checkbox>{t('Informar endereço')}</Checkbox>
              </Form.Item>

              <Form.Item
                name="inform_guardian"
                valuePropName="checked"
                initialValue={false}
                style={{marginBottom: 10, marginRight: 10}}
              >
                <Checkbox>{t('Informar responsâvel')}</Checkbox>
              </Form.Item>

              {!isEditMode && <Form.Item
                  name="keep_adding"
                  valuePropName="checked"
                  initialValue={false}
                  style={{marginBottom: 10}}
              >
                  <Checkbox>{t('Continuar adicionando')}</Checkbox>
              </Form.Item>}
            </Row>

            {informGuardian && (
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
                               rules={[{required: true, message: t('enter_guardian_type')}]}>
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
                      <Input placeholder={t('enter_guardian_phone')} maxLength={20}/>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            {informAddress && (
              <>
                <Divider>{t('address')}</Divider>

                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item name="postal_code" label={t('postal_code')}
                               rules={[{required: true, message: t('enter_code')}]}>
                      <Input placeholder={t('postal_code')} maxLength={12}/>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={16}>
                    <Form.Item name="street" label={t('street')} rules={[{required: true, message: t('enter_street')}]}>
                      <Input placeholder={t('street')} maxLength={120}/>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="number" label={t('number')} rules={[{required: true, message: t('enter_number')}]}>
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
                      <Select showSearch placeholder={t('select_country')}
                              loading={loadingCountries}
                              onChange={(value) => handleCountryChange(value)}
                              options={countries}
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="state" label={t('state_province')}
                               rules={[{required: true, message: t('select_state')}]}>
                      <Select showSearch placeholder={t('select_state')}
                              loading={loadingStates}
                              disabled={!country || loadingStates}
                              onChange={handleStateChange}
                              options={states}
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="city" label={t('city')} rules={[{required: true, message: t('enter_city')}]}>
                      <AutoComplete placeholder={t('enter_or_select')}
                                    disabled={!state}
                                    options={cities}
                                    filterOption={(inputValue, option) =>
                                      (option?.label ?? '').toUpperCase().includes(inputValue.toUpperCase())}>
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
  );
};

export default ManageClientPage;