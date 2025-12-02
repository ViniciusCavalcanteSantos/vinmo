import React, {useEffect, useState} from 'react';
import {AutoComplete, Col, DatePicker, Divider, Form, Input, Modal, Radio, Row, Select, Tooltip,} from 'antd';
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import Contract from "@/types/Contract";
import dayjs from "dayjs";
import {InfoCircleOutlined} from "@ant-design/icons";
import {useCreateContract} from "@/lib/queries/contracts/useCreateContract";
import {useUpdateContract} from "@/lib/queries/contracts/useUpdateContract";
import {useCountries} from "@/lib/queries/locations/useCountries";
import {useStates} from "@/lib/queries/locations/useStates";
import {useCities} from "@/lib/queries/locations/useCities";
import {fetchContractCategories} from "@/lib/api/contracts/fetchContractCategories";

// Props do componente
interface ManageContractModalProps {
  open: boolean;
  contract?: Contract;
  onCreate: (values: Contract) => void;
  onEdit: (values: Contract) => void;
  onCancel: () => void;
}

const ManageContractModal: React.FC<ManageContractModalProps> = ({open, contract, onCreate, onEdit, onCancel}) => {
  const {t} = useT();
  const notification = useNotification();
  const createContract = useCreateContract()
  const updateContract = useUpdateContract()

  const isEditMode = !!contract;

  const [form] = Form.useForm();
  const country = Form.useWatch('country', form);
  const state = Form.useWatch('state', form);
  const category = Form.useWatch('category', form);

  // Estados para controle de UI
  const [graduationType, setGraduationType] = useState('');

  // Estados para os dados de localização
  const [categories, setCategories] = useState<{ name: string, slug: string }[]>([]);

  const {data: countries, isLoading: isLoadingCountries} = useCountries(open)
  const {data: states, isLoading: isLoadingStates} = useStates(country, open)
  const {data: cities} = useCities(country, state)

  useEffect(() => {
    if (open) {
      fetchContractCategories()
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

      } else {
        handleClean();
      }
    };

    if (open) {
      populateFields();
    }
  }, [open, contract, form, isEditMode]);


  const handleCountryChange = () => form.setFieldsValue({state: null, city: null});
  const handleStateChange = () => form.setFieldsValue({city: null});

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

        if (isEditMode) {
          updateContract.mutate({id: contract.id, values: values}, {
            onSuccess: (res) => {
              notification.success({
                title: res.message
              })
              onEdit(res.contract)
            }
          })
        } else {
          createContract.mutate(values, {
            onSuccess: (res) => {
              notification.success({
                title: res.message
              })
              onCreate(res.contract)
            }
          });
        }

        handleClean();
      })
      .catch((err: any) => {
        notification.warning({
          title: err.message
        })
      });
  }
  return (
    <Modal
      open={open}
      title={isEditMode ? t('edit_contract') : t('create_new_contract')}
      okText={t('save_contract')}
      cancelText={t('cancel')}
      onCancel={handleCancel}
      onOk={handleOk}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        {/* CAMPOS COMUNS */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="category"
              rules={[{required: true, message: t('select_category') + "!"}]}
              label={
                <span>
                  {t('category')}&nbsp;
                  {isEditMode && (
                    <Tooltip title={t('cant_edit_contract_category')}>
                      <InfoCircleOutlined className="!text-ant-primary"/>
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
          <Col xs={24} md={12}>
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
          <Col xs={24} md={8}>
            <Form.Item name="country" label={t('country')} rules={[{required: true, message: t('select_country')}]}>
              <Select placeholder={t('select_country')}
                      loading={isLoadingCountries}
                      onChange={handleCountryChange}
                      options={countries}
                      showSearch={{
                        filterOption: (input, option) => (
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        )
                      }}/>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="state" label={t('state_province')} rules={[{required: true, message: t('select_state')}]}>
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
          <Col xs={24} md={8}>
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
                  <Col xs={24} md={16}>
                    <Form.Item name="institution_name" label={t('institution_name')}
                               rules={[{required: true, message: t('enter_institution_name')}]}>
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="institution_acronym" label={t('acronym_optional')}>
                      <Input/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="class" label={t('class')}
                               rules={[{required: true, message: t('enter_class')}]}>
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
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
                  <Col xs={24} md={12}>
                    <Form.Item name="conclusion_year" label={t('conclusion_year')}
                               rules={[{required: true, message: t('select_year')}]}>
                      <DatePicker picker="year" style={{width: '100%'}}/>
                    </Form.Item>
                  </Col>

                  {graduationType === 'university' && (
                    <Col xs={24} md={12}>
                      <Form.Item name="university_course" label={t('course_name')}
                                 rules={[{required: true, message: t('enter_course_name')}]}>
                        <Input/>
                      </Form.Item>
                    </Col>
                  )}

                  {graduationType === 'school' && (
                    <Col xs={24} md={12}>
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