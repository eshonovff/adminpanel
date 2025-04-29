// Компонент управления курсами для админ-панели с поддержкой материалов и нескольких преподавателей
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
  InputNumber,
  Popconfirm,
  message,
  Divider,
  Upload,
  Select,
  Tag,
  List,
  ConfigProvider,
  Avatar,
  Badge
} from 'antd';
import {
  GlobalOutlined,
  TranslationOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  MinusCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { GetCourseEn, GetCourseRu, GetCourseTj, PostCourse, PutCourse, DeleteCourse } from '../Api/CourseApi';
import { GetColleaguesEn, GetColleaguesRu, GetColleaguesTj } from '../Api/Colleagues'; // Для выбора преподавателя
import { useMediaQuery } from 'react-responsive';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const Course = () => {
  const dispatch = useDispatch();
  const { courseTj, courseRu, courseEn, loading } = useSelector((state) => state.CourseSlicer);
  const { colleaguesTj, colleaguesRu, colleaguesEn } = useSelector((state) => state.ColleaguesSlicer);
  
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imageFileList, setImageFileList] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  
  // Media queries для поддержки адаптивности
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  // Загрузка данных при первом рендеринге
  useEffect(() => {
    loadAllData();
    loadColleagues();
  }, [dispatch]);

  // Функция для загрузки данных о курсах
  const loadAllData = () => {
    dispatch(GetCourseTj());
    dispatch(GetCourseRu());
    dispatch(GetCourseEn());
  };

  // Функция для загрузки данных о преподавателях
  const loadColleagues = () => {
    dispatch(GetColleaguesTj());
    dispatch(GetColleaguesRu());
    dispatch(GetColleaguesEn());
  };

  // Получение текущих данных о курсах в зависимости от выбранного языка
  const getCurrentData = () => {
    switch (activeLanguage) {
      case 'en':
        return courseEn || [];
      case 'ru':
        return courseRu || [];
      case 'tj':
        return courseTj || [];
      default:
        return courseEn || [];
    }
  };

  // Получение списка преподавателей по текущему языку
  const getColleagues = () => {
    switch (activeLanguage) {
      case 'en':
        return colleaguesEn || [];
      case 'ru':
        return colleaguesRu || [];
      case 'tj':
        return colleaguesTj || [];
      default:
        return colleaguesEn || [];
    }
  };

  // УЛУЧШЕННАЯ ФУНКЦИЯ: Добавление курса с поддержкой нескольких преподавателей
  const handleAdd = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      
      // Обязательные языковые поля
      formData.append("NameTj", values.nameTj?.trim() || "");
      formData.append("NameRu", values.nameRu?.trim() || "");
      formData.append("NameEn", values.nameEn?.trim() || "");
      formData.append("DescriptionTj", values.descriptionTj?.trim() || "");
      formData.append("DescriptionRu", values.descriptionRu?.trim() || "");
      formData.append("DescriptionEn", values.descriptionEn?.trim() || "");
      
      // Общие поля
      formData.append("Price", +values.price || 0);
      formData.append("Duration", +values.duration || 3);
      
      // УЛУЧШЕНИЕ: Обработка массива преподавателей (ColleagueIds)
      if (values.colleagueIds && Array.isArray(values.colleagueIds) && values.colleagueIds.length > 0) {
        values.colleagueIds.forEach(id => {
          if (id) {
            formData.append("ColleagueIds", id);
          }
        });
      }
      
      // Материалы курса (массив строк)
      if (values.materials && Array.isArray(values.materials) && values.materials.length > 0) {
        values.materials.forEach(material => {
          if (material && material.trim()) {
            formData.append("Materials", material.trim());
          }
        });
      }
      
      // Изображение курса
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append("Image", imageFileList[0].originFileObj);
      }

      // Отправка данных на сервер
      dispatch(PostCourse(formData))
        .then(() => {
          message.success("Курс успешно добавлен!");
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

  // Получение полной информации о курсе на всех языках
  const getCourseAllLanguages = (id) => {
    const enVersion = courseEn?.find(item => item.id === id) || {};
    const ruVersion = courseRu?.find(item => item.id === id) || {};
    const tjVersion = courseTj?.find(item => item.id === id) || {};
    
    // УЛУЧШЕНИЕ: Корректное получение списка преподавателей
    const colleagues = (enVersion.colleagues || ruVersion.colleagues || tjVersion.colleagues || []);
    const colleagueIds = colleagues.map(colleague => colleague.id);
    
    return {
      id,
      imagePath: enVersion.imagePath || ruVersion.imagePath || tjVersion.imagePath,
      price: enVersion.price || ruVersion.price || tjVersion.price || 0,
      duration: enVersion.duration || ruVersion.duration || tjVersion.duration || 3,
      
      // Массив преподавателей
      colleagues,
      colleagueIds,
      
      // Материалы
      materials: enVersion.materials || ruVersion.materials || tjVersion.materials || [],
      
      // Языковые версии
      nameEn: enVersion.name || "",
      descriptionEn: enVersion.description || "",
      
      nameRu: ruVersion.name || "",
      descriptionRu: ruVersion.description || "",
      
      nameTj: tjVersion.name || "",
      descriptionTj: tjVersion.description || "",
    };
  };

  // Функция для подготовки формы редактирования
  const handleEditClick = (record) => {
    const multilingualData = getCourseAllLanguages(record.id);
    setEditingItem(multilingualData);
    
    // Устанавливаем значения формы
    editForm.setFieldsValue({
      // Языковые поля
      nameEn: multilingualData.nameEn,
      descriptionEn: multilingualData.descriptionEn,
      nameRu: multilingualData.nameRu,
      descriptionRu: multilingualData.descriptionRu,
      nameTj: multilingualData.nameTj,
      descriptionTj: multilingualData.descriptionTj,
      
      // Общие поля
      price: multilingualData.price,
      duration: multilingualData.duration,
      
      // УЛУЧШЕНИЕ: Преподаватели как массив ID
      colleagueIds: multilingualData.colleagueIds || [],
      
      // Материалы
      materials: multilingualData.materials || []
    });
    
    // Установка изображения, если оно есть
    if (multilingualData.imagePath) {
      setImageFileList([
        {
          uid: '-1',
          name: 'current-image.jpg',
          status: 'done',
          url: import.meta.env.VITE_APP_API_URL_IMAGE + multilingualData.imagePath,
        },
      ]);
    } else {
      setImageFileList([]);
    }
    
    setEditModal(true);
  };

  // УЛУЧШЕННАЯ ФУНКЦИЯ: Обновление курса с учетом нескольких преподавателей
  // ИСПРАВЛЕННАЯ ФУНКЦИЯ: Обновление курса с корректной заменой преподавателей
const handleEdit = () => {
  editForm.validateFields().then((values) => {
    const formData = new FormData();
    
    // ID курса
    formData.append("Id", editingItem.id);
    
    // Добавление языковых полей
    formData.append("NameTj", values.nameTj?.trim() || editingItem.nameTj || "");
    formData.append("NameRu", values.nameRu?.trim() || editingItem.nameRu || "");
    formData.append("NameEn", values.nameEn?.trim() || editingItem.nameEn || "");
    formData.append("DescriptionTj", values.descriptionTj?.trim() || editingItem.descriptionTj || "");
    formData.append("DescriptionRu", values.descriptionRu?.trim() || editingItem.descriptionRu || "");
    formData.append("DescriptionEn", values.descriptionEn?.trim() || editingItem.descriptionEn || "");
    
    // Общие поля
    formData.append("Price", values.price || editingItem.price || 0);
    formData.append("Duration", values.duration || editingItem.duration || 3);
    
    // ИСПРАВЛЕНИЕ: Добавление специального флага для очистки существующих преподавателей
    formData.append("ClearColleagueIds", "true");
    
    // Добавление новых преподавателей
    if (values.colleagueIds && Array.isArray(values.colleagueIds)) {
      // Сначала сравнить с исходным списком
      console.log("New colleague IDs:", values.colleagueIds);
      console.log("Original colleague IDs:", editingItem.colleagueIds || []);
      
      // Добавление преподавателей
      values.colleagueIds.forEach(id => {
        if (id) {
          formData.append("AdditionalColleagueIds", id);
        }
      });
    } else {
      // Если массив пустой или не существует, явно показываем что преподавателей нет
      formData.append("HasNoColleagues", "true");
    }
    
    // Материалы курса
    if (values.materials && Array.isArray(values.materials) && values.materials.length > 0) {
      values.materials.forEach(material => {
        if (material && material.trim()) {
          formData.append("Materials", material.trim());
        }
      });
    }
    
    // Изображение курса
    if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
      formData.append("Image", imageFileList[0].originFileObj);
    }

    // Отправка данных и вывод информации для отладки
    console.log("Sending PUT request with data:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    // Отправка данных на сервер
    dispatch(PutCourse(formData))
      .then(() => {
        message.success("Данные курса успешно обновлены!");
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
    dispatch(DeleteCourse(id))
      .then(() => {
        message.success("Курс успешно удален!");
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

  // Получение правильного склонения для слова "преподаватель"
  const getTeacherWordForm = (count) => {
    if (count === 1) return 'преподаватель';
    if (count >= 2 && count <= 4) return 'преподавателя';
    return 'преподавателей';
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
        dataIndex: 'imagePath',
        key: 'imagePath',
        width: isMobile ? 80 : 120,
        render: imagePath => (
          imagePath ? (
            <img 
              src={import.meta.env.VITE_APP_API_URL_IMAGE + imagePath} 
              alt="Course"
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
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
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
        title: 'Цена',
        dataIndex: 'price',
        key: 'price',
        width: isMobile ? 80 : 100,
        render: price => (
          <Tag color="green">
            <DollarOutlined /> {price}
          </Tag>
        )
      },
      {
        title: 'Длительность',
        dataIndex: 'duration',
        key: 'duration',
        width: isMobile ? 100 : 120,
        responsive: ['md', 'lg'], // Скрываем на мобильных
        render: duration => (
          <Tag color="blue">
            <ClockCircleOutlined /> {duration} мес.
          </Tag>
        )
      }
    ];
    
    // Для планшетов и десктопов добавляем дополнительные колонки
    if (!isMobile) {
      baseColumns.push({
        title: 'Описание',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        responsive: ['lg'], // Только для больших экранов
        render: text => (
          <Tooltip title={text}>
            <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {text}
            </div>
          </Tooltip>
        )
      });
      
      // УЛУЧШЕННАЯ КОЛОНКА: Отображение преподавателей с расширенным дизайном
      baseColumns.push({
        title: 'Преподаватели',
        dataIndex: 'colleagues',
        key: 'colleagues',
        width: 200, // Увеличена ширина колонки
        render: (colleagues) => {
          const instructors = colleagues || [];
          
          if (instructors.length === 0) {
            return <Text type="secondary">Не назначены</Text>;
          }
          
          // Улучшенное отображение для нескольких преподавателей
          return (
            <div className="instructor-display">
              {/* Заголовок с количеством */}
              <div className="flex items-center mb-2">
                <TeamOutlined style={{ marginRight: 5, color: '#1890ff' }} />
                <Text strong style={{ color: '#1890ff' }}>
                  {instructors.length} {getTeacherWordForm(instructors.length)}
                </Text>
              </div>
              
              {/* Каскадное отображение аватаров с наложением */}
              <div 
                className="instructor-avatars" 
                style={{ 
                  display: 'flex',
                  position: 'relative',
                  height: '36px'
                }}
              >
                {instructors.slice(0, 4).map((instructor, index) => (
                  <Tooltip 
                    key={index} 
                    title={
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{instructor.fullName}</div>
                        {instructor.role && <div>{instructor.role}</div>}
                      </div>
                    }
                    placement="top"
                  >
                    <Avatar
                      src={instructor.profileImage ? import.meta.env.VITE_APP_API_URL_IMAGE + instructor.profileImage : null}
                      icon={!instructor.profileImage && <UserOutlined />}
                      size={36}
                      style={{
                        position: 'absolute',
                        left: `${index * 22}px`,
                        zIndex: 10 - index,
                        border: '2px solid white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        cursor: 'pointer'
                      }}
                    />
                  </Tooltip>
                ))}
                
                {/* Если преподавателей больше 4, показываем индикатор +N */}
                {instructors.length > 4 && (
                  <Avatar
                    style={{
                      position: 'absolute',
                      left: `${4 * 22}px`,
                      zIndex: 5,
                      backgroundColor: '#1890ff',
                      color: 'white',
                      border: '2px solid white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      cursor: 'pointer'
                    }}
                    size={36}
                  >
                    +{instructors.length - 4}
                  </Avatar>
                )}
              </div>
              
              {/* Список всех преподавателей в подсказке */}
              <Tooltip
                title={
                  <List
                    size="small"
                    dataSource={instructors}
                    renderItem={(instructor) => (
                      <List.Item>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {instructor.profileImage ? (
                            <Avatar 
                              src={import.meta.env.VITE_APP_API_URL_IMAGE + instructor.profileImage} 
                              size={24} 
                            />
                          ) : (
                            <Avatar icon={<UserOutlined />} size={24} />
                          )}
                          {instructor.fullName}
                        </div>
                      </List.Item>
                    )}
                    style={{ maxHeight: '250px', overflow: 'auto' }}
                  />
                }
                placement="right"
                trigger="click"
              >
                <Button 
                  type="link" 
                  size="small" 
                  style={{ marginTop: 8, paddingLeft: 0 }}
                >
                  Показать всех
                </Button>
              </Tooltip>
            </div>
          );
        }
      });

      // Колонка с материалами курса
      baseColumns.push({
        title: 'Материалы',
        dataIndex: 'materials',
        key: 'materials',
        responsive: ['lg'], // Только для больших экранов
        render: materials => (
          Array.isArray(materials) && materials.length > 0 ? (
            <Tooltip
              title={
                <List
                  size="small"
                  dataSource={materials}
                  renderItem={(item) => <List.Item><FileTextOutlined /> {item}</List.Item>}
                />
              }
            >
              <Tag color="purple">
                <FileTextOutlined /> {materials.length} материалов
              </Tag>
            </Tooltip>
          ) : (
            <Text type="secondary">Нет материалов</Text>
          )
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

  // Рендер формы с табами по языкам (адаптивный для разных размеров экрана)
  const renderFormTabs = (formInstance, isEdit = false) => {
    // Получаем список преподавателей для выбора
    const colleagues = getColleagues();
    
    return (
      <Row gutter={16}>
        <Col xs={24} md={18}>
          <Tabs defaultActiveKey="1" size={isMobile ? "small" : "middle"}>
            <TabPane 
              tab={<span><GlobalOutlined style={{color: '#52c41a'}} /> {!isMobile && "Тоҷикӣ"}</span>} 
              key="1"
            >
              <Form.Item 
                name="nameTj" 
                label="Номи курс" 
                rules={[{ required: true, message: 'Лутфан номи курсро ворид кунед' }]}
              >
                <Input placeholder="Номи курсро бо забони тоҷикӣ ворид кунед" />
              </Form.Item>

              <Form.Item 
                name="descriptionTj" 
                label="Тавсиф" 
                rules={[{ required: true, message: 'Лутфан тавсифи курсро ворид кунед' }]}
              >
                <TextArea 
                  placeholder="Тавсифи курсро бо забони тоҷикӣ ворид кунед" 
                  rows={isMobile ? 6 : 10}
                />
              </Form.Item>
            </TabPane>

            <TabPane 
              tab={<span><GlobalOutlined style={{color: '#f5222d'}} /> {!isMobile && "Русский"}</span>} 
              key="2"
            >
              <Form.Item 
                name="nameRu" 
                label="Название курса" 
                rules={[{ required: true, message: 'Пожалуйста, введите название курса' }]}
              >
                <Input placeholder="Введите название курса на русском" />
              </Form.Item>

              <Form.Item 
                name="descriptionRu" 
                label="Описание" 
                rules={[{ required: true, message: 'Пожалуйста, введите описание курса' }]}
              >
                <TextArea 
                  placeholder="Введите описание курса на русском" 
                  rows={isMobile ? 6 : 10}
                />
              </Form.Item>
            </TabPane>

            <TabPane 
              tab={<span><GlobalOutlined style={{color: '#1890ff'}} /> {!isMobile && "English"}</span>} 
              key="3"
            >
              <Form.Item 
                name="nameEn" 
                label="Course Name" 
                rules={[{ required: true, message: 'Please enter course name' }]}
              >
                <Input placeholder="Enter course name in English" />
              </Form.Item>

              <Form.Item 
                name="descriptionEn" 
                label="Description" 
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <TextArea 
                  placeholder="Enter course description in English" 
                  rows={isMobile ? 6 : 10}
                />
              </Form.Item>
            </TabPane>
          </Tabs>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item 
            name="price" 
            label="Цена курса" 
            rules={[{ required: true, message: 'Пожалуйста, укажите цену' }]}
            initialValue={!isEdit ? 350 : undefined}
          >
            <InputNumber 
              min={0}
              addonBefore={<DollarOutlined />}
              style={{ width: '100%' }}
              placeholder="Укажите цену"
            />
          </Form.Item>

          <Form.Item 
            name="duration" 
            label="Длительность (месяцев)" 
            rules={[{ required: true, message: 'Пожалуйста, укажите длительность' }]}
            initialValue={!isEdit ? 3 : undefined}
          >
            <InputNumber 
              min={1}
              max={24}
              addonBefore={<ClockCircleOutlined />}
              style={{ width: '100%' }}
              placeholder="Укажите длительность"
            />
          </Form.Item>

          <Divider>
            <Title level={5} className="m-0">
              <TeamOutlined /> Преподаватели курса
            </Title>
          </Divider>

          {/* УЛУЧШЕННЫЙ КОМПОНЕНТ: выбор нескольких преподавателей */}
          <Form.Item 
            name="colleagueIds" 
            label="Выберите преподавателей"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.length === 0) {
                    return Promise.resolve();
                  }
                  if (value.length > 4) {
                    return Promise.reject('Максимальное количество преподавателей - 4');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Выберите преподавателей курса"
              optionFilterProp="children"
              maxTagCount={3}
              style={{ width: '100%' }}
              showSearch
              allowClear
            >
              {colleagues.map(colleague => (
                <Option key={colleague.id} value={colleague.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {colleague.profileImagePath ? (
                      <Avatar 
                        src={import.meta.env.VITE_APP_API_URL_IMAGE + colleague.profileImagePath} 
                        size={24} 
                      />
                    ) : (
                      <Avatar icon={<UserOutlined />} size={24} />
                    )}
                    {colleague.fullName}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider>
            <Title level={5} className="m-0">Изображение курса</Title>
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
              {isMobile ? "800x600 пикс." : "Рекомендуемый размер: 800x600 пикселей"}
            </Text>
          </Form.Item>

          <Divider>
            <Title level={5} className="m-0">Материалы курса</Title>
          </Divider>
          
          <Form.List name="materials">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item
                    key={key}
                    style={{ marginBottom: 8 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Form.Item
                        {...restField}
                        name={name}
                        style={{ marginBottom: 0, flex: 1 }}
                        rules={[{ required: true, message: 'Пожалуйста, введите материал' }]}
                      >
                        <Input placeholder="Например: Видео уроки, PDF учебники, тесты..." />
                      </Form.Item>
                      <Button
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        type="text"
                        danger
                        style={{ marginLeft: 8 }}
                      />
                    </div>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    icon={<PlusOutlined />} 
                    block
                  >
                    Добавить материал
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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
              <Title level={isMobile ? 5 : 4} className="m-0">Управление разделом "Курсы"</Title>
              <Text type="secondary">Добавление и редактирование информации о курсах</Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModal(true)}
              size={isMobile ? "middle" : "large"}
            >
              {isMobile ? "Добавить" : "Добавить курс"}
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
                      <p style={{ marginTop: 16 }}>Нет данных о курсах</p>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setAddModal(true)}
                        style={{ marginTop: 16 }}
                        size={isMobile ? "small" : "middle"}
                      >
                        {isMobile ? "Добавить" : "Добавить первый курс"}
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
          title="Добавление нового курса"
          open={addModal}
          onOk={handleAdd}
          onCancel={() => {
            setAddModal(false);
            form.resetFields();
            setImageFileList([]);
          }}
          width={isMobile ? "100%" : (isTablet ? 700 : 900)}
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
          title="Редактирование курса"
          open={editModal}
          onOk={handleEdit}
          onCancel={() => {
            setEditModal(false);
            editForm.resetFields();
            setImageFileList([]);
            setEditingItem(null);
          }}
          width={isMobile ? "100%" : (isTablet ? 700 : 900)}
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

export default Course;