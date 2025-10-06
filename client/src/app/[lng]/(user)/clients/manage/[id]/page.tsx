"use client";

import React, {useEffect, useState} from 'react';
import {AutoComplete, Button, Card, Checkbox, Col, DatePicker, Divider, Form, Input, Row, Select, Space} from 'antd';
import {useParams, useRouter} from 'next/navigation';
import {getCities, getCountries, getStates} from "@/lib/database/Location";
import {useT} from "@/i18n/client";
import {ApiStatus} from "@/types/ApiResponse";
import {useNotification} from "@/contexts/NotificationContext";
import ClientType, {guardianTypes} from "@/types/ClientType";
import {useClients} from "@/contexts/ClientsContext";
import dayjs from "dayjs";
import PageHeader from "@/components/PageHeader";

interface OptionType {
  value: string;
  label: string;
}

const ManageClientPage: React.FC = () => {
  const {t} = useT();
  const notification = useNotification();
  const {createClient, updateClient, fetchClient} = useClients();
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
            birthdate: clientData.birthdate ? dayjs(clientData.birthdate) : null,
          });

          if (clientData.address?.country) {
            handleCountryChange(clientData.address.country);
          }
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
    setLoadingSubmit(true);
    if (values.birthdate) {
      values.birthdate = dayjs(values.birthdate).format('YYYY-MM-DD');
    }

    let res;
    if (isEditMode) {
      res = await updateClient(Number(clientId), values);
    } else {
      res = await createClient(values);
    }

    if (res.status !== ApiStatus.SUCCESS) {
      notification.warning({message: res.message});
    } else {
      notification.success({message: res.message});

      if (keepAdding) {
        form.resetFields();
        form.setFieldsValue({keep_adding: true});
      } else {
        router.push('/clients');
      }
    }
    setLoadingSubmit(false);
  }

  return (
    <>
      <PageHeader title={isEditMode ? t('edit_client') : t('create_new_client')}/>

      <Card loading={loadingForm} variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
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

            <Form.Item
              name="keep_adding"
              valuePropName="checked"
              initialValue={false}
              style={{marginBottom: 10}}
            >
              <Checkbox>{t('Continuar adicionando')}</Checkbox>
            </Form.Item>
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
    </>
  );
};

export default ManageClientPage;