import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetChooseUsEn, GetChooseUsRu, GetChooseUsTj, PostChooseUs, PutChooseUs, DeleteChooseUs } from '../Api/ChooseUs';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tabs, 
  Tooltip, 
  Spin,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Divider,
  Upload,
  ConfigProvider
} from 'antd';
import {
  GlobalOutlined,
  TranslationOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ChooseUs = () => {
  const dispatch = useDispatch();
  const { chooseTj, chooseRu, chooseEn, loading } = useSelector((state) => state.ChooseSlicer);
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Media queries барои дастгирии responsive
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });


  // Загрузка данных при первом рендеринге
  useEffect(() => {
    loadAllData();
  }, [dispatch]);

  // Функция для загрузки всех данных
  const loadAllData = () => {
    dispatch(GetChooseUsTj());
    dispatch(GetChooseUsRu());
    dispatch(GetChooseUsEn());
  };

  // Получение текущих данных в зависимости от выбранного языка
  const getCurrentData = () => {
    switch (activeLanguage) {
      case 'en':
        return chooseEn || [];
      case 'ru':
        return chooseRu || [];
      case 'tj':
        return chooseTj || [];
      default:
        return chooseEn || [];
    }
  };

  const currentData = getCurrentData();
  
  // Обработка отображаемых данных для таблицы
  const getTableData = () => {
    return currentData.map(item => {
      let title, description;
      
      switch (activeLanguage) {
        case 'en':
          title = item.titleEn || item.title || item.titleEN || "No title";
          description = item.descriptionEn || item.description || item.descriptionEN || "No description";
          break;
        case 'ru':
          title = item.titleRu || item.title || item.titleRU || "Нет заголовка";
          description = item.descriptionRu || item.description || item.descriptionRU || "Нет описания";
          break;
        case 'tj':
          title = item.titleTj || item.title || item.titleTJ || "Унвон нест";
          description = item.descriptionTj || item.description || item.descriptionTJ || "Тавсиф нест";
          break;
        default:
          title = item.title || "No title";
          description = item.description || "No description";
      }
      
      return {
        ...item,
        displayTitle: title,
        displayDescription: description
      };
    });
  };

  // Получение всех языковых версий элемента
  const findAllLanguageVersions = (item) => {
    const itemId = item.id;
    
    // Создаем базовый объект результата
    let result = { ...item };
    
    // Функция для поиска элемента по ID в массиве
    const findItemById = (array) => {
      if (!array || !Array.isArray(array)) return null;
      return array.find(b => b.id === itemId);
    };
    
    // Находим элемент на всех языках
    const tjVersion = findItemById(chooseTj);
    const ruVersion = findItemById(chooseRu);
    const enVersion = findItemById(chooseEn);
    
    // Объединяем данные
    if (tjVersion) {
      result.titleTj = tjVersion.titleTj || tjVersion.title;
      result.descriptionTj = tjVersion.descriptionTj || tjVersion.description;
    }
    
    if (ruVersion) {
      result.titleRu = ruVersion.titleRu || ruVersion.title;
      result.descriptionRu = ruVersion.descriptionRu || ruVersion.description;
    }
    
    if (enVersion) {
      result.titleEn = enVersion.titleEn || enVersion.title;
      result.descriptionEn = enVersion.descriptionEn || enVersion.description;
    }
    
    return result;
  };

  // Колонки для таблицы - адаптивные для разных размеров экрана
  const getColumns = () => {
    // Базовые колонки для всех устройств
    const baseColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: isMobile ? 50 : 70,
        responsive: ['md', 'lg']
      },
      {
        title: 'Иконка',
        dataIndex: 'iconPath',
        key: 'iconPath',
        width: isMobile ? 80 : 120,
        render: iconPath => (
          iconPath ? (
            <img 
              src={import.meta.env.VITE_APP_API_URL_IMAGE + iconPath} 
              alt="Icon"
              style={{ 
                width: isMobile ? 40 : 60, 
                height: isMobile ? 40 : 60, 
                objectFit: 'contain', 
                borderRadius: 4 
              }}
            />
          ) : (
            <div 
              style={{ 
                width: isMobile ? 40 : 60, 
                height: isMobile ? 40 : 60, 
                backgroundColor: '#f5f5f5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 4,
                fontSize: isMobile ? '10px' : '14px'
              }}
            >
              {isMobile ? 'Нет' : 'Нет иконки'}
            </div>
          )
        )
      },
      {
        title: 'Заголовок',
        dataIndex: 'displayTitle',
        key: 'displayTitle',
        ellipsis: true,
        render: text => (
          <Tooltip title={text}>
            <div style={{ 
              maxWidth: isMobile ? 100 : 200, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {text}
            </div>
          </Tooltip>
        )
      }
    ];
    
    // Колонка описания для планшетов и десктопов
    if (!isMobile) {
      baseColumns.push({
        title: 'Описание',
        dataIndex: 'displayDescription',
        key: 'displayDescription',
        ellipsis: true,
        render: text => (
          <Tooltip title={text}>
            <div style={{ 
              maxWidth: isTablet ? 150 : 200, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {text}
            </div>
          </Tooltip>
        )
      });
    }
    
    // Колонка с действиями
    baseColumns.push({
      title: 'Действия',
      key: 'actions',
      width: isMobile ? 120 : 180,
      render: (_, record) => (
        <Space size="small" wrap={isMobile} direction={isMobile ? "vertical" : "horizontal"}>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEditClick(record)}
            size={isMobile ? "small" : "middle"}
          >
            {!isMobile && "Изменить"}
          </Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить этот элемент?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              size={isMobile ? "small" : "middle"}
            >
              {!isMobile && "Удалить"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    });
    
    return baseColumns;
  };

  // Функции для модального окна добавления
  const handleAdd = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      
      // Мувофиқи API скриншот, ин тарз бояд майдонҳоро номгузорӣ кунем
      formData.append("TitleTj", values.titleTj?.trim() || "");
      formData.append("DescriptionTj", values.descriptionTj?.trim() || "");
      formData.append("TitleRu", values.titleRu?.trim() || "");
      formData.append("DescriptionRu", values.descriptionRu?.trim() || "");
      formData.append("TitleEn", values.titleEn?.trim() || "");
      formData.append("DescriptionEn", values.descriptionEn?.trim() || "");
      
      // Барои файл
      if (fileList.length > 0) {
        formData.append("Icon", fileList[0].originFileObj);
      } else {
        // Агар файл интихоб нашуда бошад, "Send empty value" бояд фиристода шавад
        formData.append("Icon", '');
      }

      // Барои санҷидани маълумоти формаи FormData
      console.log("Sending data to API:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      dispatch(PostChooseUs(formData))
        .then(() => {
          message.success("Преимущество успешно добавлено!");
          setFileList([]);
          form.resetFields();
          setAddModal(false);
          loadAllData();
        })
        .catch(error => {
          console.error("POST error details:", error);
          message.error("Ошибка при добавлении: " + (error.message || "Неизвестная ошибка"));
        });
    });
  };

  // Функции для редактирования
  const handleEditClick = (record) => {
    // Получаем полные данные на всех языках
    const fullItem = findAllLanguageVersions(record);
    
    // Сохраняем данные редактируемого элемента
    setEditingItem(fullItem);
    
    // Извлекаем заголовки и описания для всех языков
    const titleEn = fullItem.titleEn || fullItem.title || "";
    const titleRu = fullItem.titleRu || "";
    const titleTj = fullItem.titleTj || "";
    const descriptionEn = fullItem.descriptionEn || fullItem.description || "";
    const descriptionRu = fullItem.descriptionRu || "";
    const descriptionTj = fullItem.descriptionTj || "";
    
    // Устанавливаем значения в форму
    editForm.setFieldsValue({
      titleEn,
      titleRu,
      titleTj,
      descriptionEn,
      descriptionRu,
      descriptionTj
    });
    
    // Устанавливаем иконку, если она есть
    if (fullItem.iconPath) {
      setFileList([
        {
          uid: '-1',
          name: 'current-icon.png',
          status: 'done',
          url: import.meta.env.VITE_APP_API_URL_IMAGE + fullItem.iconPath,
        },
      ]);
    } else {
      setFileList([]);
    }
    
    setEditModal(true);
  };

  // Обновление записи
  const handleEdit = () => {
    editForm.validateFields().then((values) => {
      const formData = new FormData();
      
      // Мувофиқи API шумо, ин майдонҳо бояд дуруст номгузорӣ шаванд
      formData.append("Id", editingItem.id);
      formData.append("TitleTj", values.titleTj?.trim() || "");
      formData.append("DescriptionTj", values.descriptionTj?.trim() || "");
      formData.append("TitleRu", values.titleRu?.trim() || "");
      formData.append("DescriptionRu", values.descriptionRu?.trim() || "");
      formData.append("TitleEn", values.titleEn?.trim() || "");
      formData.append("DescriptionEn", values.descriptionEn?.trim() || "");
      
      // Санҷед логи дуруст
      console.log("Sending data to API:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      // Барои файл
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("Icon", fileList[0].originFileObj);
      } else {
        // Агар файл нав интихоб нашуда бошад, "Send empty value" бояд фиристода шавад
        formData.append("Icon", '');
      }

      dispatch(PutChooseUs(formData))
        .then((response) => {
          console.log("API response:", response);
          message.success("Преимущество успешно обновлено!");
          setFileList([]);
          editForm.resetFields();
          setEditModal(false);
          setEditingItem(null);
          loadAllData();
        })
        .catch(error => {
          console.error("PUT error details:", error);
          message.error("Ошибка при обновлении: " + (error.message || "Неизвестная ошибка"));
        });
    });
  };

  // Удаление записи
  const handleDelete = (id) => {
    dispatch(DeleteChooseUs(id))
      .then(() => {
        message.success("Преимущество успешно удалено!");
        loadAllData();
      })
      .catch(error => {
        message.error("Ошибка при удалении: " + error.message);
      });
  };

  // Обработка загрузки изображения
  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 1) {
      return;
    }
    setFileList(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // Создание компонента формы с полями для разных языков
  const renderFormFields = () => {
    return (
      <>
        <div className="mb-6">
          <Divider>
            <Title level={5} className="m-0">Заголовки</Title>
          </Divider>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={8}>
              <div className="flex items-center mb-2">
                <GlobalOutlined className="mr-1 text-blue-500" />
                <Text strong>English</Text>
              </div>
              <Form.Item name="titleEn" rules={[{ required: true, message: 'Please enter title in English' }]}> 
                <Input placeholder="Enter title in English" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <div className="flex items-center mb-2">
                <GlobalOutlined className="mr-1 text-red-500" />
                <Text strong>Русский</Text>
              </div>
              <Form.Item name="titleRu" rules={[{ required: true, message: 'Пожалуйста, введите заголовок на русском' }]}> 
                <Input placeholder="Введите заголовок на русском" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <div className="flex items-center mb-2">
                <GlobalOutlined className="mr-1 text-green-500" />
                <Text strong>Тоҷикӣ</Text>
              </div>
              <Form.Item name="titleTj" rules={[{ required: true, message: 'Лутфан унвонро бо забони тоҷикӣ ворид кунед' }]}> 
                <Input placeholder="Унвонро бо тоҷикӣ ворид кунед" />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider>
            <Title level={5} className="m-0">Описания</Title>
          </Divider>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={8}>
              <div className="flex items-center mb-2">
                <GlobalOutlined className="mr-1 text-blue-500" />
                <Text strong>English</Text>
              </div>
              <Form.Item name="descriptionEn" rules={[{ required: true, message: 'Please enter description in English' }]}> 
                <TextArea placeholder="Enter description in English" rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <div className="flex items-center mb-2">
                <GlobalOutlined className="mr-1 text-red-500" />
                <Text strong>Русский</Text>
              </div>
              <Form.Item name="descriptionRu" rules={[{ required: true, message: 'Пожалуйста, введите описание на русском' }]}> 
                <TextArea placeholder="Введите описание на русском" rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <div className="flex items-center mb-2">
                <GlobalOutlined className="mr-1 text-green-500" />
                <Text strong>Тоҷикӣ</Text>
              </div>
              <Form.Item name="descriptionTj" rules={[{ required: true, message: 'Лутфан тавсифро бо забони тоҷикӣ ворид кунед' }]}> 
                <TextArea placeholder="Тавсифро бо тоҷикӣ ворид кунед" rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider>
          <Title level={5} className="m-0">Иконка</Title>
        </Divider>
        
        <Form.Item>
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleFileChange}
            maxCount={1}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Text type="secondary">Рекомендуемый размер: 64x64 пикселей, формат: PNG с прозрачностью</Text>
        </Form.Item>
      </>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          // Глобальные настройки темы
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
        components: {
          Table: {
            headerBg: '#f5f5f5',
            headerSplitColor: '#e8e8e8',
            // Установка минимальной ширины колонок для мобильных устройств
            cellPaddingInline: isMobile ? 4 : 16,
            cellPaddingBlock: isMobile ? 6 : 12,
            fontSize: isMobile ? 12 : 14,
          },
          Modal: {
            paddingContentHorizontalLG: isMobile ? 16 : 24,
          }
        }
      }}
    >
      <div className="p-2 sm:p-4 md:p-6">
        <Card className="shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="mb-3 sm:mb-0">
              <Title level={isMobile ? 5 : 4} className="m-0">Управление блоком "Почему нас выбирают"</Title>
              <Text type="secondary">Добавление и редактирование преимуществ компании</Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModal(true)}
              size={isMobile ? "middle" : "large"}
            >
              {isMobile ? "Добавить" : "Добавить преимущество"}
            </Button>
          </div>

          <Divider className="my-2 sm:my-3" />

          <Tabs 
            activeKey={activeLanguage} 
            onChange={setActiveLanguage}
            size={isMobile ? "small" : "middle"}
            tabBarGutter={isMobile ? 8 : 16}
            tabBarExtraContent={
              <Tooltip title="Просмотр контента на разных языках">
                <TranslationOutlined style={{ marginRight: '10px' }} />
              </Tooltip>
            }
          >
            <TabPane tab={<span><GlobalOutlined /> {!isMobile && "English"}</span>} key="en" />
            <TabPane tab={<span><GlobalOutlined /> {!isMobile && "Русский"}</span>} key="ru" />
            <TabPane tab={<span><GlobalOutlined /> {!isMobile && "Тоҷикӣ"}</span>} key="tj" />
          </Tabs>

          {loading ? (
            <div className="flex justify-center items-center py-10 sm:py-20">
              <Spin size={isMobile ? "default" : "large"} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table 
                dataSource={getTableData()} 
                columns={getColumns()} 
                rowKey="id"
                pagination={{ 
                  pageSize: isMobile ? 5 : 10,
                  size: isMobile ? "small" : "default" 
                }}
                scroll={{ x: isMobile ? 500 : 'max-content' }}
                size={isMobile ? "small" : "middle"}
                locale={{ 
                  emptyText: (
                    <div style={{ padding: isMobile ? 16 : 24, textAlign: 'center' }}>
                      <InfoCircleOutlined style={{ fontSize: isMobile ? 32 : 48, color: '#ccc' }} />
                      <p style={{ marginTop: 16 }}>Нет данных</p>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setAddModal(true)}
                        style={{ marginTop: 16 }}
                        size={isMobile ? "small" : "middle"}
                      >
                        {isMobile ? "Добавить" : "Добавить первое преимущество"}
                      </Button>
                    </div>
                  ) 
                }}
              />
            </div>
          )}
        </Card>

        {/* Модальное окно для добавления */}
        <Modal
          title="Добавление нового преимущества"
          open={addModal}
          onOk={handleAdd}
          onCancel={() => {
            setAddModal(false);
            form.resetFields();
            setFileList([]);
          }}
          width={isMobile ? "100%" : (isTablet ? 600 : 800)}
          okText="Добавить"
          cancelText="Отмена"
          bodyStyle={{ maxHeight: isMobile ? '70vh' : 'auto', overflowY: 'auto' }}
          maskClosable={false}
        >
          <Form layout="vertical" form={form}>
            {renderFormFields(form)}
          </Form>
        </Modal>

        {/* Модальное окно для редактирования */}
        <Modal
          title="Редактирование преимущества"
          open={editModal}
          onOk={handleEdit}
          onCancel={() => {
            setEditModal(false);
            editForm.resetFields();
            setFileList([]);
            setEditingItem(null);
          }}
          width={isMobile ? "100%" : (isTablet ? 600 : 800)}
          okText="Сохранить"
          cancelText="Отмена"
          bodyStyle={{ maxHeight: isMobile ? '70vh' : 'auto', overflowY: 'auto' }}
          maskClosable={false}
        >
          <Form layout="vertical" form={editForm}>
            {renderFormFields(editForm)}
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default ChooseUs;