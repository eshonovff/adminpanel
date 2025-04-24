// Компонент управления новостями для админ-панели
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Select,
  Tag,
  DatePicker,
  Badge,
  Avatar,
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
  CalendarOutlined,
  UserOutlined,
  HeartOutlined,
  TagOutlined
} from '@ant-design/icons';
import { GetNewsEn, GetNewsRu, GetNewsTj, PostNews, PutNews, DeleteNews } from '../Api/NewsApi';
import { useMediaQuery } from 'react-responsive';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

// Категории новостей
const NEWS_CATEGORIES = ['IT', 'Education', 'Languages', 'Events', 'Updates', 'Other'];

const News = () => {
  const dispatch = useDispatch();
  const { newsTj, newsRu, newsEn, loading } = useSelector((state) => state.NewsSlicer);
  
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imageFileList, setImageFileList] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  
  // Media queries для адаптивности
  const isMobile = useMediaQuery({ maxWidth: 767 });


  // Загрузка данных при первом рендеринге
  useEffect(() => {
    loadAllData();
  }, [dispatch]);

  // Функция для загрузки всех данных
  const loadAllData = () => {
    dispatch(GetNewsTj());
    dispatch(GetNewsRu());
    dispatch(GetNewsEn());
  };

  // Получение текущих данных в зависимости от выбранного языка
  const getCurrentData = () => {
    switch (activeLanguage) {
      case 'en':
        return newsEn || [];
      case 'ru':
        return newsRu || [];
      case 'tj':
        return newsTj || [];
      default:
        return newsEn || [];
    }
  };

  // Получение языковых версий для новости
  const getNewsAllLanguages = (id) => {
    // Найдем новость на всех языках
    const enVersion = newsEn?.find(item => item.id === id) || {};
    const ruVersion = newsRu?.find(item => item.id === id) || {};
    const tjVersion = newsTj?.find(item => item.id === id) || {};
    
    return {
      // Общие поля
      id,
      image: enVersion.image || ruVersion.image || tjVersion.image,
      mediaUrl: enVersion.mediaUrl || ruVersion.mediaUrl || tjVersion.mediaUrl,
      category: enVersion.category || ruVersion.category || tjVersion.category || "Other",
      author: enVersion.author || ruVersion.author || tjVersion.author || "",
      likeCount: enVersion.likeCount || ruVersion.likeCount || tjVersion.likeCount || 0,
      createdAt: enVersion.createdAt || ruVersion.createdAt || tjVersion.createdAt,
      
      // Языковые версии
      titleEn: enVersion.title || "",
      summaryEn: enVersion.summary || "",
      contentEn: enVersion.content || "",
      
      titleRu: ruVersion.title || "",
      summaryRu: ruVersion.summary || "",
      contentRu: ruVersion.content || "",
      
      titleTj: tjVersion.title || "",
      summaryTj: tjVersion.summary || "",
      contentTj: tjVersion.content || "",
    };
  };

  // Колонки для таблицы с учетом размера экрана
  const getColumns = () => {
    const baseColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: isMobile ? 50 : 70,
        responsive: ['md', 'lg'] // Скрываем на мобильных
      },
      {
        title: 'Изображение',
        dataIndex: 'image',
        key: 'image',
        width: isMobile ? 80 : 120,
        render: imagePath => (
          imagePath ? (
            <img 
              src={import.meta.env.VITE_APP_API_URL_IMAGE + imagePath} 
              alt="News"
              style={{ 
                width: isMobile ? 50 : 80, 
                height: isMobile ? 50 : 80, 
                objectFit: 'cover', 
                borderRadius: '8px' 
              }}
            />
          ) : (
            <div 
              style={{ 
                width: isMobile ? 50 : 80, 
                height: isMobile ? 50 : 80, 
                backgroundColor: '#f5f5f5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '8px',
                fontSize: isMobile ? '10px' : '14px'
              }}
            >
              {isMobile ? 'Нет' : 'Нет фото'}
            </div>
          )
        )
      },
      {
        title: 'Заголовок',
        dataIndex: 'title',
        key: 'title',
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
      },
      {
        title: 'Категория',
        dataIndex: 'category',
        key: 'category',
        width: isMobile ? 90 : 120,
        responsive: ['md', 'lg'], // Скрываем на мобильных
        render: category => (
          <Tag color="blue">
            <TagOutlined /> {category}
          </Tag>
        )
      },
      {
        title: 'Дата',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: isMobile ? 100 : 150,
        responsive: ['md', 'lg'], // Скрываем на мобильных
        render: date => (
          <Tooltip title={new Date(date).toLocaleString()}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CalendarOutlined style={{ marginRight: 8 }} />
              {dayjs(date).format('DD.MM.YYYY')}
            </div>
          </Tooltip>
        )
      }
    ];
    
    // Для планшетов и десктопов добавляем дополнительные колонки
    if (!isMobile) {
      baseColumns.push({
        title: 'Автор',
        dataIndex: 'author',
        key: 'author',
        responsive: ['lg'], // Только для больших экранов
        render: author => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar icon={<UserOutlined />} size="small" style={{ marginRight: 8 }} />
            {author || 'Не указан'}
          </div>
        )
      });
      
      baseColumns.push({
        title: 'Лайки',
        dataIndex: 'likeCount',
        key: 'likeCount',
        width: 100,
        responsive: ['lg'], // Только для больших экранов
        render: count => (
          <Badge count={count} showZero overflowCount={999} style={{ backgroundColor: '#ff4d4f' }}>
            <HeartOutlined style={{ fontSize: 18, color: '#ff4d4f', padding: '0 8px' }} />
          </Badge>
        )
      });
    }
    
    // Колонка с действиями
    baseColumns.push({
      title: 'Действия',
      key: 'actions',
      width: isMobile ? 100 : 180,
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
            title="Вы уверены?"
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
      
      // English
      formData.append("TitleEn", values.titleEn?.trim() || "");
      formData.append("SummaryEn", values.summaryEn?.trim() || "");
      formData.append("ContentEn", values.contentEn?.trim() || "");
      
      // Russian
      formData.append("TitleRu", values.titleRu?.trim() || "");
      formData.append("SummaryRu", values.summaryRu?.trim() || "");
      formData.append("ContentRu", values.contentRu?.trim() || "");
      
      // Tajik
      formData.append("TitleTj", values.titleTj?.trim() || "");
      formData.append("SummaryTj", values.summaryTj?.trim() || "");
      formData.append("ContentTj", values.contentTj?.trim() || "");
      
      // Common fields
      formData.append("Category", values.category || "Other");
      formData.append("Author", values.author?.trim() || "");
      
      // Изображение новости
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append("Media", imageFileList[0].originFileObj);
      } else {
        formData.append("Media", "");
      }

      // Консоль лог для проверки
      console.log("Sending data to API:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      dispatch(PostNews(formData))
        .then(() => {
          message.success("Новость успешно добавлена!");
          setImageFileList([]);
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
    // Получаем данные новости на всех языках
    const multilingualData = getNewsAllLanguages(record.id);
    setEditingItem(multilingualData);
    
    // Устанавливаем значения формы
    editForm.setFieldsValue({
      // English
      titleEn: multilingualData.titleEn,
      summaryEn: multilingualData.summaryEn,
      contentEn: multilingualData.contentEn,
      
      // Russian
      titleRu: multilingualData.titleRu,
      summaryRu: multilingualData.summaryRu,
      contentRu: multilingualData.contentRu,
      
      // Tajik
      titleTj: multilingualData.titleTj,
      summaryTj: multilingualData.summaryTj,
      contentTj: multilingualData.contentTj,
      
      // Common
      category: multilingualData.category,
      author: multilingualData.author
    });
    
    if (multilingualData.image) {
      setImageFileList([
        {
          uid: '-1',
          name: 'current-image.jpg',
          status: 'done',
          url: import.meta.env.VITE_APP_API_URL_IMAGE + multilingualData.image,
        },
      ]);
    } else {
      setImageFileList([]);
    }
    
    setEditModal(true);
  };

  // Обновление записи
  const handleEdit = () => {
    editForm.validateFields().then((values) => {
      const formData = new FormData();
      
      formData.append("Id", editingItem.id);
      
      // English
      formData.append("TitleEn", values.titleEn?.trim() || editingItem.titleEn || "");
      formData.append("SummaryEn", values.summaryEn?.trim() || editingItem.summaryEn || "");
      formData.append("ContentEn", values.contentEn?.trim() || editingItem.contentEn || "");
      
      // Russian
      formData.append("TitleRu", values.titleRu?.trim() || editingItem.titleRu || "");
      formData.append("SummaryRu", values.summaryRu?.trim() || editingItem.summaryRu || "");
      formData.append("ContentRu", values.contentRu?.trim() || editingItem.contentRu || "");
      
      // Tajik
      formData.append("TitleTj", values.titleTj?.trim() || editingItem.titleTj || "");
      formData.append("SummaryTj", values.summaryTj?.trim() || editingItem.summaryTj || "");
      formData.append("ContentTj", values.contentTj?.trim() || editingItem.contentTj || "");
      
      // Common fields
      formData.append("Category", values.category || editingItem.category || "Other");
      formData.append("Author", values.author?.trim() || editingItem.author || "");
      
      // Изображение новости
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append("ImageFile", imageFileList[0].originFileObj);
      } else {
        formData.append("ImageFile", "");
      }

      // Консоль лог для проверки
      console.log("Sending data to API:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      dispatch(PutNews(formData))
        .then(() => {
          message.success("Новость успешно обновлена!");
          setImageFileList([]);
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
    dispatch(DeleteNews(id))
      .then(() => {
        message.success("Новость успешно удалена!");
        loadAllData();
      })
      .catch(error => {
        message.error("Ошибка при удалении: " + error.message);
      });
  };

  // Обработка загрузки изображения
  const handleImageFileChange = ({ fileList }) => {
    if (fileList.length > 1) {
      return;
    }
    setImageFileList(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // Рендер формы с табами по языкам (адаптивный для разных размеров экрана)
  const renderFormTabs = (formInstance, isEdit = false) => {
    return (
      <Row gutter={16}>
        <Col xs={24} md={16}>
          <Tabs defaultActiveKey="1" size={isMobile ? "small" : "middle"}>
            <TabPane 
              tab={<span><GlobalOutlined style={{color: '#1890ff'}} /> {!isMobile && "English"}</span>} 
              key="1"
            >
              <Form.Item 
                name="titleEn" 
                label="Title" 
                rules={[{ required: true, message: 'Please enter title' }]}
              >
                <Input placeholder="Enter news title in English" />
              </Form.Item>

              <Form.Item 
                name="summaryEn" 
                label="Summary" 
                rules={[{ required: true, message: 'Please enter summary' }]}
              >
                <TextArea 
                  placeholder="Enter news summary in English" 
                  rows={isMobile ? 3 : 4}
                />
              </Form.Item>

              <Form.Item 
                name="contentEn" 
                label="Content" 
                rules={[{ required: true, message: 'Please enter content' }]}
              >
                <TextArea 
                  placeholder="Enter full news content in English" 
                  rows={isMobile ? 6 : 12}
                />
              </Form.Item>
            </TabPane>

            <TabPane 
              tab={<span><GlobalOutlined style={{color: '#f5222d'}} /> {!isMobile && "Русский"}</span>} 
              key="2"
            >
              <Form.Item 
                name="titleRu" 
                label="Заголовок" 
                rules={[{ required: true, message: 'Пожалуйста, введите заголовок' }]}
              >
                <Input placeholder="Введите заголовок новости на русском" />
              </Form.Item>

              <Form.Item 
                name="summaryRu" 
                label="Краткое описание" 
                rules={[{ required: true, message: 'Пожалуйста, введите краткое описание' }]}
              >
                <TextArea 
                  placeholder="Введите краткое описание новости на русском" 
                  rows={isMobile ? 3 : 4}
                />
              </Form.Item>

              <Form.Item 
                name="contentRu" 
                label="Содержание" 
                rules={[{ required: true, message: 'Пожалуйста, введите содержание' }]}
              >
                <TextArea 
                  placeholder="Введите полное содержание новости на русском" 
                  rows={isMobile ? 6 : 12}
                />
              </Form.Item>
            </TabPane>

            <TabPane 
              tab={<span><GlobalOutlined style={{color: '#52c41a'}} /> {!isMobile && "Тоҷикӣ"}</span>} 
              key="3"
            >
              <Form.Item 
                name="titleTj" 
                label="Сарлавҳа" 
                rules={[{ required: true, message: 'Лутфан сарлавҳаро ворид кунед' }]}
              >
                <Input placeholder="Сарлавҳаи хабарро бо забони тоҷикӣ ворид кунед" />
              </Form.Item>

              <Form.Item 
                name="summaryTj" 
                label="Шарҳи мухтасар" 
                rules={[{ required: true, message: 'Лутфан шарҳи мухтасарро ворид кунед' }]}
              >
                <TextArea 
                  placeholder="Шарҳи мухтасари хабарро бо забони тоҷикӣ ворид кунед" 
                  rows={isMobile ? 3 : 4}
                />
              </Form.Item>

              <Form.Item 
                name="contentTj" 
                label="Мундариҷа" 
                rules={[{ required: true, message: 'Лутфан мундариҷаро ворид кунед' }]}
              >
                <TextArea 
                  placeholder="Мундариҷаи пурраи хабарро бо забони тоҷикӣ ворид кунед" 
                  rows={isMobile ? 6 : 12}
                />
              </Form.Item>
            </TabPane>
          </Tabs>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item 
            name="category" 
            label="Категория" 
            rules={[{ required: true, message: 'Пожалуйста, выберите категорию' }]}
            initialValue={!isEdit ? "Other" : undefined}
          >
            <Select placeholder="Выберите категорию">
              {NEWS_CATEGORIES.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="author" 
            label="Автор" 
          >
            <Input 
              placeholder="Укажите автора новости" 
              prefix={<UserOutlined />} 
            />
          </Form.Item>

          <Divider>
            <Title level={5} className="m-0">Изображение новости</Title>
          </Divider>
          
          <Form.Item>
            <Upload
              listType="picture-card"
              fileList={imageFileList}
              beforeUpload={() => false}
              onChange={handleImageFileChange}
              maxCount={1}
            >
              {imageFileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Text type="secondary">
              {isMobile ? "800x400 пикс." : "Рекомендуемый размер: 800x400 пикселей"}
            </Text>
          </Form.Item>

          {isEdit && (
            <>
              <Divider>
                <Title level={5} className="m-0">Информация</Title>
              </Divider>
              
              <div>
                <Text type="secondary">ID: </Text>
                <Text strong>{editingItem?.id}</Text>
              </div>
              
              {editingItem?.createdAt && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Дата создания: </Text>
                  <Text strong>{dayjs(editingItem.createdAt).format('DD.MM.YYYY HH:mm')}</Text>
                </div>
              )}
              
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Лайки: </Text>
                <Text strong>{editingItem?.likeCount || 0}</Text>
              </div>
            </>
          )}
        </Col>
      </Row>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
        components: {
          Table: {
            headerBg: '#f5f5f5',
            headerSplitColor: '#e8e8e8',
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
            <div className="mb-3 sm:mb-0">
              <Title level={isMobile ? 5 : 4} className="m-0">Управление новостями</Title>
              <Text type="secondary">Добавление и редактирование новостей компании</Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModal(true)}
              size={isMobile ? "middle" : "large"}
            >
              {isMobile ? "Добавить" : "Добавить новость"}
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
                dataSource={getCurrentData()} 
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
                      <p style={{ marginTop: 16 }}>Нет данных о новостях</p>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setAddModal(true)}
                        style={{ marginTop: 16 }}
                        size={isMobile ? "small" : "middle"}
                      >
                        {isMobile ? "Добавить" : "Добавить первую новость"}
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
          title="Добавление новой новости"
          open={addModal}
          onOk={handleAdd}
          onCancel={() => {
            setAddModal(false);
            form.resetFields();
            setImageFileList([]);
          }}
          width={isMobile ? "100%" : 1000}
          okText="Добавить"
          cancelText="Отмена"
          bodyStyle={{ maxHeight: isMobile ? '70vh' : 'auto', overflowY: 'auto' }}
          maskClosable={false}
        >
          <Form layout="vertical" form={form}>
            {renderFormTabs(form)}
          </Form>
        </Modal>

        {/* Модальное окно для редактирования */}
        <Modal
          title="Редактирование новости"
          open={editModal}
          onOk={handleEdit}
          onCancel={() => {
            setEditModal(false);
            editForm.resetFields();
            setImageFileList([]);
            setEditingItem(null);
          }}
          width={isMobile ? "100%" : 1000}
          okText="Сохранить"
          cancelText="Отмена"
          bodyStyle={{ maxHeight: isMobile ? '70vh' : 'auto', overflowY: 'auto' }}
          maskClosable={false}
        >
          <Form layout="vertical" form={editForm}>
            {renderFormTabs(editForm, true)}
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default News;