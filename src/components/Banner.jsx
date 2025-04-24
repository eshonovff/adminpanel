import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PostBanner, DeleteBanner, GetBannerTj, GetBannerRu, GetBannerEn, PutBanner } from "../Api/Bannerapi";
import { 
  Button, 
  Card, 
  Modal, 
  Input, 
  Form, 
  Upload, 
  Tabs, 
  Empty, 
  Tooltip, 
  message, 
  Spin, 
  Popconfirm,
  Divider,
  Typography,
  Space,
  Tag,
  Alert,
  Row,
  Col,
  ConfigProvider
} from "antd";
import { 
  DeleteOutlined, 
  EditOutlined, 
  PictureOutlined,
  EyeOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  TranslationOutlined,
  InfoCircleOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { useMediaQuery } from 'react-responsive';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const BannerAdmin = () => {
  const dispatch = useDispatch();
  const { bannerTj, bannerRu, bannerEn, loading } = useSelector((state) => state.BannerSlicer);
  const [addBannerModal, setAddBannerModal] = useState(false);
  const [editBannerModal, setEditBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  
  // Media queries барои дастгирии responsive
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  
  // Подробный вывод данных для отладки
  useEffect(() => {

  }, [bannerTj, bannerRu, bannerEn]);
   
  useEffect(() => {
    // Загружаем данные при первой загрузке компонента
    loadAllBanners();
  }, [dispatch]);

  // Функция для загрузки всех баннеров
  const loadAllBanners = () => {
    dispatch(GetBannerTj());
    dispatch(GetBannerRu());
    dispatch(GetBannerEn());
  };

  // Получаем текущий список баннеров в зависимости от выбранного языка
  const getCurrentBanners = () => {
    let banners = [];
    switch (activeLanguage) {
      case "en":
        banners = bannerEn || [];
        break;
      case "ru":
        banners = bannerRu || [];
        break;
      case "tj":
        banners = bannerTj || [];
        break;
      default:
        banners = bannerEn || [];
    }
    
    return banners;
  };

  const banners = getCurrentBanners();

  const handleAddBanner = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      formData.append("TitleEn", values.titleEn?.trim() || "");
      formData.append("TitleRu", values.titleRu?.trim() || "");
      formData.append("TitleTj", values.titleTj?.trim() || "");
      formData.append("DescriptionEn", values.descriptionEn?.trim() || "");
      formData.append("DescriptionRu", values.descriptionRu?.trim() || "");
      formData.append("DescriptionTj", values.descriptionTj?.trim() || "");
      
      if (fileList.length > 0) {
        formData.append("ImageFile", fileList[0].originFileObj);
      } else {
        message.error("Пожалуйста, выберите изображение!");
        return;
      }

      dispatch(PostBanner(formData))
        .then(() => {
          message.success("Баннер успешно добавлен!");
          setFileList([]);
          form.resetFields();
          setAddBannerModal(false);
          
          // Обновляем списки баннеров после успешного добавления
          loadAllBanners();
        })
        .catch(error => {
          message.error("Ошибка при добавлении баннера: " + error.message);
        });
    });
  };
  
  const handleEditBanner = () => {
    editForm.validateFields().then((values) => {
      if (!editingBanner || !editingBanner.id) {
        message.error("Ошибка: Не удалось получить ID баннера");
        return;
      }

      const formData = new FormData();
      formData.append("Id", editingBanner.id);
      
      // Заголовки
      formData.append("TitleEn", values.titleEn?.trim() || "");
      formData.append("TitleRu", values.titleRu?.trim() || "");
      formData.append("TitleTj", values.titleTj?.trim() || "");
      
      // Описания
      formData.append("DescriptionEn", values.descriptionEn?.trim() || "");
      formData.append("DescriptionRu", values.descriptionRu?.trim() || "");
      formData.append("DescriptionTj", values.descriptionTj?.trim() || "");
      
      // Изображение (если новое)
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("ImageFile", fileList[0].originFileObj);
      }

      // Отправляем запрос на обновление баннера через PutBanner
      dispatch(PutBanner(formData))
        .then(() => {
          message.success("Баннер успешно обновлен!");
          
          // Обновляем списки баннеров после успешного обновления
          loadAllBanners();
          
          // Закрываем модальное окно и сбрасываем форму
          setFileList([]);
          editForm.resetFields();
          setEditBannerModal(false);
          setEditingBanner(null);
        })
        .catch(error => {
          message.error("Ошибка при обновлении баннера: " + error.message);
        });
    });
  };

  const handleCancelBannerModal = () => {
    setFileList([]);
    form.resetFields();
    setAddBannerModal(false);
  };

  const handleCancelEditModal = () => {
    setFileList([]);
    editForm.resetFields();
    setEditBannerModal(false);
    setEditingBanner(null);
  };

  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 1) {
      return;
    }
    setFileList(fileList);
  };

  // Получение всех языковых версий баннера
  const findAllLanguageVersions = (banner) => {
    const bannerId = banner.id;
    let result = { ...banner }; // Копируем базовый баннер
    
    // Функция поиска баннера по ID в массиве
    const findBannerById = (array) => {
      if (!array || !Array.isArray(array)) return null;
      return array.find(b => b.id === bannerId);
    };
    
    // Поиск баннеров на всех языках
    const tjVersion = findBannerById(bannerTj);
    const ruVersion = findBannerById(bannerRu);
    const enVersion = findBannerById(bannerEn);
    
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

  const handleEditClick = (banner) => {
    // Получаем полные данные со всех языков
    const fullBanner = findAllLanguageVersions(banner);
    
    // Сохраняем данные редактируемого баннера
    setEditingBanner(fullBanner);
    
    // Заголовки и описания из всех языковых версий
    const titleEn = fullBanner.titleEn || fullBanner.title || fullBanner.titleEN || "";
    const titleRu = fullBanner.titleRu || fullBanner.titleRU || "";
    const titleTj = fullBanner.titleTj || fullBanner.titleTJ || "";
    const descriptionEn = fullBanner.descriptionEn || fullBanner.description || fullBanner.descriptionEN || "";
    const descriptionRu = fullBanner.descriptionRu || fullBanner.descriptionRU || "";
    const descriptionTj = fullBanner.descriptionTj || fullBanner.descriptionTJ || "";
    
    // Устанавливаем значения в форму
    editForm.setFieldsValue({
      titleEn,
      titleRu,
      titleTj,
      descriptionEn,
      descriptionRu,
      descriptionTj
    });
    
    // Set the file list if there's an image
    if (fullBanner.imagePath) {
      setFileList([
        {
          uid: '-1',
          name: 'current-image.jpg',
          status: 'done',
          url: import.meta.env.VITE_APP_API_URL_IMAGE + fullBanner.imagePath,
        },
      ]);
    } else {
      setFileList([]);
    }
    
    setEditBannerModal(true);
  };

  const handleDeleteBanner = (bannerId) => {
    dispatch(DeleteBanner(bannerId))
      .then(() => {
        message.success("Баннер успешно удален!");
        
        // Обновляем списки баннеров после успешного удаления
        loadAllBanners();
      })
      .catch(error => {
        message.error("Ошибка при удалении баннера: " + error.message);
      });
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const getLanguageTag = (language) => {
    switch (language) {
      case 'en':
        return <Tag color="blue">EN</Tag>;
      case 'ru':
        return <Tag color="volcano">RU</Tag>;
      case 'tj':
        return <Tag color="green">TJ</Tag>;
      default:
        return null;
    }
  };

  // Render empty state with message
  const renderEmptyState = () => {
    return (
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm flex flex-col items-center">
        <Alert
          message={isMobile ? "Баннеры отсутствуют" : "Место для баннеров пусто"}
          description={isMobile ? "Добавьте баннеры для вашего сайта" : "Пожалуйста, добавьте баннеры для того, чтобы ваш веб-сайт выглядел привлекательно. Баннеры отображаются на главной странице и являются важной частью пользовательского опыта."}
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className="mb-4 sm:mb-6 w-full"
        />
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" align="center" className="mt-2 sm:mt-4">
              <Text type="secondary">Баннеры отсутствуют</Text>
              {!isMobile && (
                <Text>Добавьте баннеры, чтобы улучшить визуальное оформление вашего сайта</Text>
              )}
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setAddBannerModal(true)}
                size={isMobile ? "middle" : "large"}
                className="mt-2 sm:mt-4"
              >
                {isMobile ? "Добавить" : "Добавить первый баннер"}
              </Button>
            </Space>
          }
        />
        {!isMobile && (
          <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg w-full max-w-xl">
            <Title level={5}>
              <InfoCircleOutlined className="mr-2 text-blue-500" /> 
              Рекомендации
            </Title>
            <ul className="list-disc pl-4 sm:pl-5 mt-2 text-gray-700 text-sm sm:text-base">
              <li>Используйте изображения высокого качества (рекомендуемый размер: 1920x800 пикселей)</li>
              <li>Добавьте привлекательные и краткие заголовки</li>
              <li>Включите призыв к действию в описании</li>
              <li>Поддерживайте баннеры на всех языках вашего сайта</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Создание компонента формы с полями для разных языков
  const renderFormFields = () => {
    return (
      <>
        <div className="mb-4 sm:mb-6">
          <Divider>
            <Title level={5} className="m-0">Заголовки</Title>
          </Divider>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={8}>
              <div className="flex items-center mb-2">
                <GlobalOutlined className="mr-1 text-blue-500" />
                <Text strong>English</Text>
                <Tag color="blue" className="ml-1">EN</Tag>
              </div>
              <Form.Item name="titleEn" rules={[{ required: true, message: 'Please enter title in English' }]}> 
                <Input placeholder="Enter title in English" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <div className="flex items-center mb-2">
                <GlobalOutlined className="mr-1 text-red-500" />
                <Text strong>Русский</Text>
                <Tag color="volcano" className="ml-1">RU</Tag>
              </div>
              <Form.Item name="titleRu" rules={[{ required: true, message: 'Пожалуйста, введите заголовок на русском' }]}> 
                <Input placeholder="Введите заголовок на русском" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <div className="flex items-center mb-2">
                <GlobalOutlined className="mr-1 text-green-500" />
                <Text strong>Тоҷикӣ</Text>
                <Tag color="green" className="ml-1">TJ</Tag>
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
                <Tag color="blue" className="ml-1">EN</Tag>
              </div>
              <Form.Item name="descriptionEn" rules={[{ required: true, message: 'Please enter description in English' }]}> 
                <Input.TextArea placeholder="Enter description in English" rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <div className="flex items-center mb-2">
                <GlobalOutlined className="mr-1 text-red-500" />
                <Text strong>Русский</Text>
                <Tag color="volcano" className="ml-1">RU</Tag>
              </div>
              <Form.Item name="descriptionRu" rules={[{ required: true, message: 'Пожалуйста, введите описание на русском' }]}> 
                <Input.TextArea placeholder="Введите описание на русском" rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <div className="flex items-center mb-2">
                <GlobalOutlined className="mr-1 text-green-500" />
                <Text strong>Тоҷикӣ</Text>
                <Tag color="green" className="ml-1">TJ</Tag>
              </div>
              <Form.Item name="descriptionTj" rules={[{ required: true, message: 'Лутфан тавсифро бо забони тоҷикӣ ворид кунед' }]}> 
                <Input.TextArea placeholder="Тавсифро бо тоҷикӣ ворид кунед" rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider>
          <Title level={5} className="m-0">Изображение баннера</Title>
        </Divider>
        
        <Form.Item 
          rules={[{ required: true, message: 'Пожалуйста, загрузите изображение' }]}
        > 
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleFileChange}
            maxCount={1}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Text type="secondary">
            {isMobile 
              ? "Формат: JPG, PNG" 
              : "Рекомендуемый размер: 1920x800 пикселей, формат: JPG, PNG"
            }
          </Text>
        </Form.Item>
      </>
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
          Card: {
            paddingLG: isMobile ? 12 : 24,
          },
          Modal: {
            paddingContentHorizontalLG: isMobile ? 16 : 24,
          }
        }
      }}
    >
      <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <Card className="shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
            <div className="mb-3 sm:mb-0">
              <Title level={isMobile ? 5 : 4} className="m-0">Управление баннерами</Title>
              <Text type="secondary">Добавление и редактирование баннеров для главной страницы</Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddBannerModal(true)}
              size={isMobile ? "middle" : "large"}
            >
              {isMobile ? "Добавить" : "Добавить баннер"}
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
            <div className="mt-3 sm:mt-4">
              {banners?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {banners.map((banner) => {
                    // Определяем правильные поля заголовка и описания в зависимости от языка
                    let title, description;
                    
                    // Изменение: более подробная проверка полей для каждого языка
                    switch (activeLanguage) {
                      case 'en':
                        // Проверяем разные варианты названий полей для английского
                        title = banner.titleEn || banner.title || banner.titleEN || "No title";
                        description = banner.descriptionEn || banner.description || banner.descriptionEN || "No description";
                        break;
                      case 'ru':
                        // Для русского языка проверяем все возможные варианты названий полей
                        title = banner.titleRu || banner.title || banner.titleRU || "Нет заголовка";
                        description = banner.descriptionRu || banner.description || banner.descriptionRU || "Нет описания";
                        break;
                      case 'tj':
                        // Для таджикского языка проверяем все возможные варианты названий полей
                        title = banner.titleTj || banner.title || banner.titleTJ || "Унвон нест";
                        description = banner.descriptionTj || banner.description || banner.descriptionTJ || "Тавсиф нест";
                        break;
                      default:
                        title = banner.title || "No title";
                        description = banner.description || "No description";
                    }
                    
                    // Проверка и исправление проблемы с отображением названий на разных языках
                    if (activeLanguage === 'ru' && title === "Нет заголовка" && banner.title) {
                      title = banner.title;
                    }
                    if (activeLanguage === 'tj' && title === "Унвон нест" && banner.title) {
                      title = banner.title;
                    }
                    
                    return (
                      <Card
                        key={banner.id}
                        className="hover:shadow-md transition-shadow overflow-hidden"
                        size={isMobile ? "small" : "default"}
                        cover={
                          <div className="relative group">
                            <img
                              src={import.meta.env.VITE_APP_API_URL_IMAGE + banner.imagePath}
                              alt={title}
                              className="w-full h-32 sm:h-40 md:h-48 object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Tooltip title="Предпросмотр">
                                <Button 
                                  type="primary" 
                                  shape="circle" 
                                  icon={<EyeOutlined />} 
                                  className="mr-2"
                                  size={isMobile ? "small" : "middle"}
                                />
                              </Tooltip>
                            </div>
                            {getLanguageTag(activeLanguage)}
                          </div>
                        }
                        actions={[
                          <Tooltip title="Редактировать">
                            <Button 
                              icon={<EditOutlined />} 
                              onClick={() => handleEditClick(banner)}
                              size={isMobile ? "small" : "middle"}
                            >
                              {!isMobile && "Изменить"}
                            </Button>
                          </Tooltip>,
                          <Popconfirm
                            title="Вы уверены, что хотите удалить этот баннер?"
                            onConfirm={() => handleDeleteBanner(banner.id)}
                            okText="Да"
                            cancelText="Нет"
                            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                          >
                            <Tooltip title="Удалить">
                              <Button 
                                icon={<DeleteOutlined />} 
                                danger
                                size={isMobile ? "small" : "middle"}
                              >
                                {!isMobile && "Удалить"}
                              </Button>
                            </Tooltip>
                          </Popconfirm>
                        ]}
                      >
                        <div className="h-20 sm:h-24 md:h-32">
                          <Title level={5} ellipsis={{ rows: 1 }} className="mb-1 sm:mb-2">
                            {title}
                          </Title>
                          <Paragraph 
                            ellipsis={{ rows: isMobile ? 2 : 3 }} 
                            className="text-gray-500 text-sm sm:text-base"
                          >
                            {description}
                          </Paragraph>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                renderEmptyState()
              )}
            </div>
          )}
        </Card>
        
        {/* Modal for Adding Banner */}
        <Modal
          title={
            <div className="flex items-center">
              <PictureOutlined className="mr-2 text-blue-500" />
              <span>Добавление нового баннера</span>
            </div>
          }
          open={addBannerModal}
          onOk={handleAddBanner}
          onCancel={handleCancelBannerModal}
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

        {/* Modal for Editing Banner */}
        <Modal
          title={
            <div className="flex items-center">
              <EditOutlined className="mr-2 text-blue-500" />
              <span>Редактирование баннера</span>
            </div>
          }
          open={editBannerModal}
          onOk={handleEditBanner}
          onCancel={handleCancelEditModal}
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

export default BannerAdmin;