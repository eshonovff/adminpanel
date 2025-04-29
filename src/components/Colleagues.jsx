// Компонент Colleagues с возможностью загрузки иконок вручную
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
  FileImageOutlined
} from '@ant-design/icons';
import { GetColleaguesEn, GetColleaguesRu, GetColleaguesTj, PostColleagues, PutColleagues, DeleteColleagues } from '../Api/Colleagues';
import { useMediaQuery } from 'react-responsive';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const Colleagues = () => {
  const dispatch = useDispatch();
  const { colleaguesTj, colleaguesRu, colleaguesEn, loading } = useSelector((state) => state.ColleaguesSlicer);
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imageFileList, setImageFileList] = useState([]); // Для основного изображения
  const [iconFilesList, setIconFilesList] = useState([]); // Для иконок технологий
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
    dispatch(GetColleaguesTj());
    dispatch(GetColleaguesRu());
    dispatch(GetColleaguesEn());
  };

  // Получение текущих данных в зависимости от выбранного языка
  const getCurrentData = () => {
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

  // Сортировка данных, сначала директора, потом преподаватели
  const sortedData = () => {
    const currentData = getCurrentData();
    return [...currentData].sort((a, b) => {
      if (a.role === 'director' && b.role !== 'director') return -1;
      if (a.role !== 'director' && b.role === 'director') return 1;
      return 0;
    });
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
        title: 'Фото',
        dataIndex: 'profileImagePath',
        key: 'profileImagePath',
        width: isMobile ? 80 : 120,
        render: profileImagePath => (
          profileImagePath ? (
            <img 
              src={import.meta.env.VITE_APP_API_URL_IMAGE + profileImagePath} 
              alt="Profile"
              style={{ 
                width: isMobile ? 50 : 80, 
                height: isMobile ? 50 : 80, 
                objectFit: 'cover', 
                borderRadius: '50%' 
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
                borderRadius: '50%',
                fontSize: isMobile ? '10px' : '14px'
              }}
            >
              {isMobile ? 'Нет' : 'Нет фото'}
            </div>
          )
        )
      },
      {
        title: 'Имя',
        dataIndex: 'fullName',
        key: 'fullName',
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
        title: 'Роль',
        dataIndex: 'role',
        key: 'role',
        width: isMobile ? 90 : 120,
        render: role => {
          let color = 'green';
          let text = isMobile ? 'Преп.' : 'Преподаватель';
          
          if (role === 'director') {
            color = 'gold';
            text = 'Директор';
          }
          
          return (
            <Tag color={color}>
              {text}
            </Tag>
          );
        }
      }
    ];
    
    // Для планшетов и десктопов добавляем дополнительные колонки
    if (!isMobile) {
      baseColumns.push({
        title: 'О себе',
        dataIndex: 'aboute',
        key: 'aboute',
        ellipsis: true,
        responsive: ['md', 'lg'], // Только для средних и больших экранов
        render: text => (
          <Tooltip title={text}>
            <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {text}
            </div>
          </Tooltip>
        )
      });
      
      baseColumns.push({
        title: 'Резюме',
        dataIndex: 'summary',
        key: 'summary',
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
      
      baseColumns.push({
        title: 'Технологии',
        dataIndex: 'knowingIcons',
        key: 'knowingIcons',
        width: isMobile ? 100 : 150,
        render: icons => (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {Array.isArray(icons) && icons.slice(0, isTablet ? 2 : 3).map((icon, index) => (
              <Tooltip key={index} title="Технология">
                <img 
                  src={import.meta.env.VITE_APP_API_URL_IMAGE + icon} 
                  alt={`Tech ${index + 1}`}
                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                />
              </Tooltip>
            ))}
            {Array.isArray(icons) && icons.length > (isTablet ? 2 : 3) && (
              <Tooltip title={`Еще ${icons.length - (isTablet ? 2 : 3)} технологий`}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  +{icons.length - (isTablet ? 2 : 3)}
                </div>
              </Tooltip>
            )}
          </div>
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

  // Получение языковых версий для сотрудника
  const getColleagueAllLanguages = (id) => {
    // Найдем сотрудника на всех языках
    const enVersion = colleaguesEn?.find(item => item.id === id) || {};
    const ruVersion = colleaguesRu?.find(item => item.id === id) || {};
    const tjVersion = colleaguesTj?.find(item => item.id === id) || {};
    
    return {
      // Общие поля
      id,
      role: enVersion.role || ruVersion.role || tjVersion.role || "teacher",
      profileImagePath: enVersion.profileImagePath || ruVersion.profileImagePath || tjVersion.profileImagePath,
      knowingIcons: enVersion.knowingIcons || ruVersion.knowingIcons || tjVersion.knowingIcons || [],
      
      // Языковые версии
      fullNameEn: enVersion.fullName || "",
      abouteEn: enVersion.aboute || "",
      summaryEn: enVersion.summary || "",
      
      fullNameRu: ruVersion.fullName || "",
      abouteRu: ruVersion.aboute || "",
      summaryRu: ruVersion.summary || "",
      
      fullNameTj: tjVersion.fullName || "",
      abouteTj: tjVersion.aboute || "",
      summaryTj: tjVersion.summary || "",
    };
  };

  // Функции для модального окна добавления
  const handleAdd = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      
      // English
      formData.append("FullNameEn", values.fullNameEn?.trim() || "");
      formData.append("AbouteEn", values.abouteEn?.trim() || "");
      formData.append("SummaryEn", values.summaryEn?.trim() || "");
      
      // Russian
      formData.append("FullNameRu", values.fullNameRu?.trim() || "");
      formData.append("AbouteRu", values.abouteRu?.trim() || "");
      formData.append("SummaryRu", values.summaryRu?.trim() || "");
      
      // Tajik
      formData.append("FullNameTj", values.fullNameTj?.trim() || "");
      formData.append("AbouteTj", values.abouteTj?.trim() || "");
      formData.append("SummaryTj", values.summaryTj?.trim() || "");
      
      // Common fields
      formData.append("RoleTj", values.role || "teacher");
      
      // Аксро ҳамчун ImageFile илова мекунем
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append("ImageFile", imageFileList[0].originFileObj);
      } else {
        // Агар тасвир интихоб нашуда бошад, "Send empty value" ро мефиристем
        formData.append("ImageFile", '');
      }
      
      // Добавляем иконки технологий как IconFiles (массив)
      if (iconFilesList.length > 0) {
        // Для каждой выбранной иконки добавляем отдельный параметр с тем же именем
        iconFilesList.forEach(file => {
          if (file.originFileObj) {
            formData.append("IconFiles", file.originFileObj);
          }
        });
      } else {
        // Если иконки не выбраны, отправляем пустое значение
        formData.append("IconFiles", '');
      }

      // Консоль лог для проверки
      console.log("Sending data to API:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      dispatch(PostColleagues(formData))
        .then(() => {
          message.success("Сотрудник успешно добавлен!");
          setImageFileList([]);
          setIconFilesList([]);
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
    // Получаем данные сотрудника на всех языках
    const multilingualData = getColleagueAllLanguages(record.id);
    setEditingItem(multilingualData);
    
    // Устанавливаем значения формы
    editForm.setFieldsValue({
      // English
      fullNameEn: multilingualData.fullNameEn,
      abouteEn: multilingualData.abouteEn,
      summaryEn: multilingualData.summaryEn,
      
      // Russian
      fullNameRu: multilingualData.fullNameRu,
      abouteRu: multilingualData.abouteRu,
      summaryRu: multilingualData.summaryRu,
      
      // Tajik
      fullNameTj: multilingualData.fullNameTj,
      abouteTj: multilingualData.abouteTj,
      summaryTj: multilingualData.summaryTj,
      
      // Common
      role: multilingualData.role
    });
    
    if (multilingualData.profileImagePath) {
      setImageFileList([
        {
          uid: '-1',
          name: 'current-photo.jpg',
          status: 'done',
          url: import.meta.env.VITE_APP_API_URL_IMAGE + multilingualData.profileImagePath,
        },
      ]);
    } else {
      setImageFileList([]);
    }
    
    // Если есть иконки технологий, показываем их
    if (multilingualData.knowingIcons && multilingualData.knowingIcons.length > 0) {
      const iconFiles = multilingualData.knowingIcons.map((icon, index) => ({
        uid: `-${index + 1}`,
        name: `icon-${index + 1}.png`,
        status: 'done',
        url: import.meta.env.VITE_APP_API_URL_IMAGE + icon,
      }));
      setIconFilesList(iconFiles);
    } else {
      setIconFilesList([]);
    }
    
    setEditModal(true);
  };

  // Обновление записи
// Обновление записи
const handleEdit = () => {
  editForm.validateFields().then((values) => {
    const formData = new FormData();
    
    // Добавляем ID - главный параметр
    formData.append("Id", editingItem.id);
    
    // Основные данные на трех языках
    // Таджикский
    formData.append("FullNameTj", values.fullNameTj?.trim() || editingItem.fullNameTj || "");
    formData.append("AbouteTj", values.abouteTj?.trim() || editingItem.abouteTj || "");
    formData.append("SummaryTj", values.summaryTj?.trim() || editingItem.summaryTj || "");
    
    // Русский
    formData.append("FullNameRu", values.fullNameRu?.trim() || editingItem.fullNameRu || "");
    formData.append("AbouteRu", values.abouteRu?.trim() || editingItem.abouteRu || "");
    formData.append("SummaryRu", values.summaryRu?.trim() || editingItem.summaryRu || "");
    
    // Английский
    formData.append("FullNameEn", values.fullNameEn?.trim() || editingItem.fullNameEn || "");
    formData.append("AbouteEn", values.abouteEn?.trim() || editingItem.abouteEn || "");
    formData.append("SummaryEn", values.summaryEn?.trim() || editingItem.summaryEn || "");
    
    // Роль сотрудника (teacher или director)
    formData.append("RoleTj", values.role || editingItem.role || "teacher");
    
    // Обработка фотографии
    if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
      // Если загружен новый файл изображения
      formData.append("ProfileImage", imageFileList[0].originFileObj);
    } else {
      // Если новое изображение не выбрано, но нужно очистить старое
      formData.append("ProfileImage", '');
    }
    
    // Обработка иконок
    if (iconFilesList.length > 0) {
      // Проверяем новые файлы
      iconFilesList.forEach(file => {
        if (file.originFileObj) {
          formData.append("Icons", file.originFileObj);
        }
      });
    } else {
      // Если пусто, отправляем пустое значение
      formData.append("Icons", '');
    }

    // Добавляем эту проверку для вывода данных в консоль
    console.log("Отправляемые данные:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    // Отправляем запрос
    dispatch(PutColleagues(formData))
      .then(() => {
        message.success("Данные сотрудника успешно обновлены!");
        setImageFileList([]);
        setIconFilesList([]);
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
    dispatch(DeleteColleagues(id))
      .then(() => {
        message.success("Сотрудник успешно удален!");
        loadAllData();
      })
      .catch(error => {
        message.error("Ошибка при удалении: " + error.message);
      });
  };

  // Обработка загрузки основного изображения
  const handleImageFileChange = ({ fileList }) => {
    if (fileList.length > 1) {
      return;
    }
    setImageFileList(fileList);
  };

  // Обработка загрузки иконок технологий
  const handleIconFilesChange = ({ fileList }) => {
    // Можно ограничить количество файлов, если нужно
    setIconFilesList(fileList);
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
        <Col xs={24} md={18}>
          <Tabs defaultActiveKey="1" size={isMobile ? "small" : "middle"}>
            <TabPane 
              tab={<span><GlobalOutlined style={{color: '#1890ff'}} /> {!isMobile && "English"}</span>} 
              key="1"
            >
              <Form.Item 
                name="fullNameEn" 
                label="Full Name" 
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input placeholder="Enter full name in English" />
              </Form.Item>

              <Form.Item 
                name="abouteEn" 
                label="About (full biography)" 
                rules={[{ required: true, message: 'Please enter biography' }]}
              >
                <TextArea 
                  placeholder="Enter full biography in English" 
                  rows={isMobile ? 3 : 4}
                />
              </Form.Item>

              <Form.Item 
                name="summaryEn" 
                label="Summary" 
                rules={[{ required: true, message: 'Please enter summary' }]}
              >
                <TextArea 
                  placeholder="Enter brief summary in English" 
                  rows={isMobile ? 2 : 2}
                />
              </Form.Item>
            </TabPane>

            <TabPane 
              tab={<span><GlobalOutlined style={{color: '#f5222d'}} /> {!isMobile && "Русский"}</span>} 
              key="2"
            >
              <Form.Item 
                name="fullNameRu" 
                label="ФИО" 
                rules={[{ required: true, message: 'Пожалуйста, введите ФИО' }]}
              >
                <Input placeholder="Введите ФИО на русском" />
              </Form.Item>

              <Form.Item 
                name="abouteRu" 
                label="О себе (полная биография)" 
                rules={[{ required: true, message: 'Пожалуйста, введите биографию' }]}
              >
                <TextArea 
                  placeholder="Введите полную биографию на русском" 
                  rows={isMobile ? 3 : 4}
                />
              </Form.Item>

              <Form.Item 
                name="summaryRu" 
                label="Краткое резюме" 
                rules={[{ required: true, message: 'Пожалуйста, введите краткое резюме' }]}
              >
                <TextArea 
                  placeholder="Введите краткое резюме на русском" 
                  rows={isMobile ? 2 : 2}
                />
              </Form.Item>
            </TabPane>

            <TabPane 
              tab={<span><GlobalOutlined style={{color: '#52c41a'}} /> {!isMobile && "Тоҷикӣ"}</span>} 
              key="3"
            >
              <Form.Item 
                name="fullNameTj" 
                label="Ному насаб" 
                rules={[{ required: true, message: 'Лутфан ному насабро ворид кунед' }]}
              >
                <Input placeholder="Ному насабро бо забони тоҷикӣ ворид кунед" />
              </Form.Item>

              <Form.Item 
                name="abouteTj" 
                label="Дар бораи худ (тарҷумаи ҳоли пурра)" 
                rules={[{ required: true, message: 'Лутфан тарҷумаи ҳоли пурраро ворид кунед' }]}
              >
                <TextArea 
                  placeholder="Тарҷумаи ҳоли пурраро бо забони тоҷикӣ ворид кунед" 
                  rows={isMobile ? 3 : 4}
                />
              </Form.Item>

              <Form.Item 
                name="summaryTj" 
                label="Хулосаи мухтасар" 
                rules={[{ required: true, message: 'Лутфан хулосаи мухтасарро ворид кунед' }]}
              >
                <TextArea 
                  placeholder="Хулосаи мухтасарро бо забони тоҷикӣ ворид кунед" 
                  rows={isMobile ? 2 : 2}
                />
              </Form.Item>
            </TabPane>
          </Tabs>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item 
            name="role" 
            label="Роль сотрудника" 
            initialValue={!isEdit ? "teacher" : undefined}
            rules={[{ required: true, message: 'Пожалуйста, выберите роль' }]}
          >
            <Select placeholder="Выберите роль">
              <Option value="director">Директор</Option>
              <Option value="teacher">Преподаватель</Option>
            </Select>
          </Form.Item>

          <Divider>
            <Title level={5} className="m-0">Фотография</Title>
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
              {isMobile ? "300x300 пикс." : "Рекомендуемый размер: 300x300 пикселей"}
            </Text>
          </Form.Item>
          
          {/* Новый блок выбора иконок технологий */}
          <Divider>
            <Title level={5} className="m-0">
              <FileImageOutlined className="mr-2" />
              Иконки технологий
            </Title>
          </Divider>
          
          <Form.Item>
            <Upload
              listType="picture-card"
              fileList={iconFilesList}
              beforeUpload={() => false}
              onChange={handleIconFilesChange}
              multiple
            >
              {iconFilesList.length >= 8 ? null : uploadButton}
            </Upload>
            <Text type="secondary">
              {isMobile ? "Иконки 64x64 пикс." : "Рекомендуемый размер иконок: 64x64 пикселей, формат: PNG"}
            </Text>
          </Form.Item>
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
              <Title level={isMobile ? 5 : 4} className="m-0">Управление разделом "Наши сотрудники"</Title>
              <Text type="secondary">Информация о сотрудниках и преподавателях</Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModal(true)}
              size={isMobile ? "middle" : "large"}
            >
              {isMobile ? "Добавить" : "Добавить сотрудника"}
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
                dataSource={sortedData()} 
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
                      <p style={{ marginTop: 16 }}>Нет данных о сотрудниках</p>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setAddModal(true)}
                        style={{ marginTop: 16 }}
                        size={isMobile ? "small" : "middle"}
                      >
                        {isMobile ? "Добавить" : "Добавить первого сотрудника"}
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
          title="Добавление нового сотрудника"
          open={addModal}
          onOk={handleAdd}
          onCancel={() => {
            setAddModal(false);
            form.resetFields();
            setImageFileList([]);
            setIconFilesList([]);
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
          title="Редактирование данных сотрудника"
          open={editModal}
          onOk={handleEdit}
          onCancel={() => {
            setEditModal(false);
            editForm.resetFields();
            setImageFileList([]);
            setIconFilesList([]);
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

export default Colleagues;