"use client"

import {AutoComplete, Col, Form, Input, Row, Select} from "antd";
import Title from "@/components/Title";
import {PrimaryButton} from "@/components/PrimaryButton";
import {useT} from "@/i18n/client";
import {useLocalStorage} from "react-use";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getCities, getCountries, getStates} from "@/lib/database/Location";
import {FullAddressType} from "@/types/Address";


interface OptionType {
  value: string;
  label: string;
}

export default function Address() {
  const {t} = useT();
  const [__, setAddress] = useLocalStorage<FullAddressType | null>("address")
  const [emailConfirmation] = useLocalStorage<string | null>('emailConfirmation', null)
  const router = useRouter();

  const [form] = Form.useForm();
  const country = Form.useWatch('country', form);
  const state = Form.useWatch('state', form);

  const [countries, setCountries] = useState<OptionType[]>([]);
  const [states, setStates] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [_, setLoadingCities] = useState(false);

  useEffect(() => {
    setLoadingCountries(true);
    getCountries()
      .then(data => {
        setCountries(data.countries);
      })
      .finally(() => setLoadingCountries(false));
  }, []);

  useEffect(() => {
    if (!emailConfirmation) router.push('/signup');
  }, [emailConfirmation]);

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

  const handleFinish = async (values: any) => {
    setAddress({
      granularity: 'full_address',
      ...values
    })
    router.push('/signup/finish');
  }

  return (
    <Form
      className="
        !w-full max-w-140
        bg-ant-bg-elevated
        border border-ant-border-sec
        !px-10 !py-8 rounded-sm
        shadow-[0_0_10px_rgba(0,0,0,0.1)]
      "
      form={form}
      initialValues={{remember: true}}
      onFinish={handleFinish}
      requiredMark={false}
      layout="vertical"
    >
      <div className="flex items-center justify-center text-3xl text-ant-text mb-6">
        <Title/>
      </div>
      <h1 className="text-center font-semibold text-ant-text-sec text-xl">
        {t('address')}
      </h1>
      <p className="text-center text-ant-text-ter text-sm mb-2">{t('login.please_inform_your_address')}</p>

      <Form.Item
        layout="vertical"
        label={t('postal_code')}
        name="postal_code"
        rules={[{required: true, max: 12}]}
        style={{marginBottom: 12}}
      >
        <Input placeholder={t('enter_postal_code')}
               style={{padding: "10px 16px"}} maxLength={12}/>
      </Form.Item>

      <Row gutter={16}>
        <Col span={16}>
          <Form.Item
            layout="vertical"
            label={t('street')}
            name="street"
            rules={[{required: true, max: 120}]}
            style={{marginBottom: 12}}
          >
            <Input placeholder={t('enter_street')}
                   style={{padding: "10px 16px"}} maxLength={120}/>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            layout="vertical"
            label={t('number')}
            name="number"
            rules={[{required: true, max: 12}]}
            style={{marginBottom: 12}}
          >
            <Input placeholder={t('enter_number')} className="!py-2.5 !px-4" maxLength={12}/>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        layout="vertical"
        label={t('neighborhood')}
        name="neighborhood"
        rules={[{required: true, max: 40}]}
        style={{marginBottom: 12}}
      >
        <Input placeholder={t('enter_neighborhood')} className="!py-2.5 !px-4" maxLength={40}/>
      </Form.Item>

      <Form.Item
        layout="vertical"
        label={t('country')}
        name="country"
        rules={[{required: true, max: 255}]}
        style={{marginBottom: 12}}
      >
        <Select
          className="!h-11"
          showSearch placeholder={t('select_country')}
          loading={loadingCountries}
          onChange={(value) => handleCountryChange(value)}
          options={countries}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="state" label={t('state_province')}
                     rules={[{required: true, message: t('select_state')}]}
                     style={{marginBottom: 12}}>
            <Select

              className="!h-11"
              showSearch placeholder={t('select_state')}
              loading={loadingStates}
              disabled={!country || loadingStates}
              onChange={handleStateChange}
              options={states}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="city" label={t('city')} rules={[{required: true, message: t('enter_city')}]}
                     style={{marginBottom: 12}}>
            <AutoComplete
              className="!h-11 [&_input]:h-11"
              style={{height: 399}}
              placeholder={t('enter_or_select')}
              disabled={!state}
              options={cities}
              filterOption={(inputValue, option) =>
                (option?.label ?? '').toUpperCase().includes(inputValue.toUpperCase())}>
              <Input/>
            </AutoComplete>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        layout="vertical"
        label={t('complement')}
        name="complement"
        rules={[{max: 120}]}
        style={{marginBottom: 20}}
      >
        <Input placeholder={t('enter_complement')} className="!py-2.5 !px-4" maxLength={120}/>
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit">
          {t('next')}
        </PrimaryButton>
      </Form.Item>
    </Form>
  )
}