import React, {useEffect, useState} from 'react';
import {AutoComplete, Col, DatePicker, Divider, Form, Input, Modal, Radio, Row, Select, Tooltip,} from 'antd';
import {getCategories, getCities, getCountries, getStates} from "@/lib/database/Location";
import {useT} from "@/i18n/client";
import {ApiStatus} from "@/types/ApiResponse";
import {useNotification} from "@/contexts/NotificationContext";
import ContractType from "@/types/ContractType";
import {useContracts} from "@/contexts/ContractsContext";
import dayjs from "dayjs";
import {InfoCircleOutlined} from "@ant-design/icons";

interface OptionType {
  value: string;
  label: string;
}

// Props do componente
interface ManageContractModalProps {
  open: boolean;
  contract?: ContractType;
  onCreate: (values: ContractType) => void;
  onEdit: (values: ContractType) => void;
  onCancel: () => void;
}

const ManageContractModal: React.FC<ManageContractModalProps> = ({open, contract, onCreate, onEdit, onCancel}) => {
  const {t} = useT();
  const notification = useNotification();
  const {createContract, updateContract} = useContracts();

  const isEditMode = !!contract;

  const [form] = Form.useForm();
  const country = Form.useWatch('country', form);
  const state = Form.useWatch('state', form);
  const category = Form.useWatch('category', form);

  // Estados para controle de UI
  const [graduationType, setGraduationType] = useState('');

  // Estados para os dados de localização
  const [categories, setCategories] = useState<{ name: string, slug: string }[]>([]);
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [states, setStates] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);

  // Estados para controle de carregamento
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [_, setLoadingCities] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingCountries(true);
      getCountries()
        .then(data => {
          setCountries(data.countries);
        })
        .finally(() => setLoadingCountries(false));
      getCategories()
        .then(data => {
          setCategories(data.categories);
        })
    }
  }, [open]);

  useEffect(() => {
    const populateFields = async () => {
      if (isEditMode && contract) {
        form.setFieldsValue({
          code: contract.code,
          title: contract.title,
          category: contract.category.slug,
          country: contract.address.country,
          state: contract.address.state,
          city: contract.address.city,
          type: contract.graduationDetails?.type,
          institution_name: contract.graduationDetails?.institutionName,
          institution_acronym: contract.graduationDetails?.institutionAcronym,
          class: contract.graduationDetails?.className,
          shift: contract.graduationDetails?.shift,
          conclusion_year: contract.graduationDetails?.conclusionYear ? dayjs().year(contract.graduationDetails?.conclusionYear) : null,
          university_course: contract.graduationDetails?.universityCourse,
        });

        // Atualiza os estados internos do componente que controlam a UI
        if (category === 'graduation') {
          setGraduationType(contract.graduationDetails?.type ?? '');
        }

        // Carrega estados e cidades com base nos dados do contrato
        if (contract.address.country) {
          setLoadingStates(true);
          getStates(contract.address.country)
            .then(data => {
              setStates(data.states);
              if (contract.address.state) {
                setLoadingCities(true);
                getCities(contract.address.country, contract.address.state)
                  .then(cityData => setCities(cityData.cities))
                  .finally(() => setLoadingCities(false));
              }
            })
            .finally(() => setLoadingStates(false));
        }
      } else {
        // Garante que o formulário está limpo se não for modo de edição
        handleClean();
      }
    };

    if (open) {
      populateFields();
    }
  }, [open, contract, form, isEditMode]);


  const handleCountryChange = (countryCode: string) => {
    form.setFieldsValue({state: null, city: null});
    setStates([]);
    setCities([]);
    if (countryCode) {
      setLoadingStates(true);
      getStates(countryCode)
        .then(data => setStates(data.states))
        .finally(() => setLoadingStates(false));
    }
  };

  const handleStateChange = (stateCode: string) => {
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

  const handleCategoryChange = (value: string) => {
    if (value !== 'graduation') {
      setGraduationType('');
      form.setFieldsValue({
        type: undefined,
        institution_name: undefined,
        institution_acronym: undefined,
        class: undefined,
        shift: undefined,
        conclusion_year: undefined,
        university_course: undefined,
        school_grade_level: undefined,
      });
    }
  };

  const handleClean = () => {
    form.resetFields();
    setGraduationType('');
    setStates([]);
    setCities([]);
  }

  const handleCancel = () => {
    handleClean();
    onCancel();
  }

  const handleOk = () => {
    form.validateFields()
      .then(async (values) => {
        if (values.conclusion_year) {
          values.conclusion_year = values.conclusion_year.year();
        }
        let res;
        if (isEditMode) {
          res = await updateContract(contract.id, values);
        } else {
          res = await createContract(values);
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
          onEdit(res.contract)
        } else {
          onCreate(res.contract);
        }
      })
      .catch(() => {
      });
  }
  return (
    <Modal
      open={open}
      title={isEditMode ? t('edit_contract') : t('create_new_contract')}
      okText={t('save_contract')}
      cancelText={t('cancel')}
      width={800}
      onCancel={handleCancel}
      onOk={handleOk}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        {/* CAMPOS COMUNS */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="category"
              rules={[{required: true, message: t('select_category') + "!"}]}
              label={
                <span>
                  {t('category')}&nbsp;
                  {isEditMode && (
                    <Tooltip title={t('cant_edit_contract_category')}>
                      <InfoCircleOutlined style={{color: 'rgba(0,0,0,.45)'}}/>
                    </Tooltip>
                  )}
                </span>
              }
            >
              <Select
                disabled={isEditMode}
                placeholder={t('select_category')}
                onChange={handleCategoryChange}
                options={categories.map(category => {
                  return {value: category.slug, label: category.name};
                })}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="code" label={t('contract_code')}
                       rules={[{required: true, message: t('enter_contract_code')}]}>
              <Input placeholder={t('contract_code_ex')}/>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="title" label={t('contract_title')} rules={[{required: true, message: t('enter_title')}]}>
          <Input placeholder={t('contract_title_ex')}/>
        </Form.Item>

        {/* CAMPOS DE LOCALIZAÇÃO */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="country" label={t('country')} rules={[{required: true, message: t('select_country')}]}>
              <Select showSearch placeholder={t('select_country')}
                      loading={loadingCountries}
                      onChange={handleCountryChange}
                      options={countries}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="state" label={t('state_province')} rules={[{required: true, message: t('select_state')}]}>
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

        {category === 'graduation' && (
          <>
            <Divider>{t('graduation_details')}</Divider>
            <Form.Item name="type" label={t('graduation_type')} rules={[{required: true, message: t('select_type')}]}>
              <Radio.Group onChange={(e) => setGraduationType(e.target.value)}>
                <Radio value="university">{t('university')}</Radio>
                <Radio value="school">{t('school')}</Radio>
              </Radio.Group>
            </Form.Item>

            {graduationType && (
              <>
                <Row gutter={16}>
                  <Col span={16}>
                    <Form.Item name="institution_name" label={t('institution_name')}
                               rules={[{required: true, message: t('enter_institution_name')}]}>
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="institution_acronym" label={t('acronym_optional')}>
                      <Input/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="class" label={t('class')}
                               rules={[{required: true, message: t('enter_class')}]}>
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="shift" label={t('shift')}
                               rules={[{required: true, message: t('select_shift')}]}>
                      <Select placeholder={t('select')} options={[
                        {value: 'morning', label: t('morning')},
                        {value: 'afternoon', label: t('afternoon')},
                        {value: 'night', label: t('night')},
                        {value: 'full_time', label: t('full_time')},
                      ]}/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="conclusion_year" label={t('conclusion_year')}
                               rules={[{required: true, message: t('select_year')}]}>
                      <DatePicker picker="year" style={{width: '100%'}}/>
                    </Form.Item>
                  </Col>

                  {graduationType === 'university' && (
                    <Col span={12}>
                      <Form.Item name="university_course" label={t('course_name')}
                                 rules={[{required: true, message: t('enter_course_name')}]}>
                        <Input/>
                      </Form.Item>
                    </Col>
                  )}

                  {graduationType === 'school' && (
                    <Col span={12}>
                      <Form.Item name="school_grade_level" label={t('grade_level')}
                                 rules={[{required: true, message: t('select_grade_level')}]}>
                        <Select placeholder={t('select')} options={[
                          {value: 'elementary_school', label: t('elementary_school')},
                          {value: 'middle_school', label: t('middle_school')},
                          {value: 'high_school', label: t('high_school')},
                        ]}/>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </>
            )}
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ManageContractModal;