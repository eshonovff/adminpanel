import { useState } from "react";
import { Tabs, Card, Button, Divider, Tooltip } from "antd";
import Banner from "../../components/Banner";
import {
  PictureOutlined,
  CheckCircleOutlined,
  ReadOutlined,
  PictureOutlined as GalleryIcon,
  NotificationOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  UndoOutlined,
  EyeOutlined,
  TeamOutlined
} from "@ant-design/icons";
import ChooseUs from "../../components/ChooseUs";
import Colleagues from "../../components/Colleagues";
import Course from "../../components/Course";
import Gallery from "../../components/Gallery";
import News from "../../components/News";

const { TabPane } = Tabs;

const DesignPage = () => {
  const [activeSection, setActiveSection] = useState("banner");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Function to simulate saving changes
  const handleSaveChanges = () => {
    setTimeout(() => {
      setHasUnsavedChanges(false);
    }, 800);
  };

  // Components map to load based on active section
  const componentMap = {
    banner: <Banner />,
    chooseUs: <ChooseUs />,
    colleagues: <Colleagues />,
    course: <Course />,
    gallery: <Gallery />,
    news: <News />,
  };

  // Section data with icons
  const sections = [
    { key: "banner", label: "Banner", icon: <PictureOutlined /> },
    { key: "chooseUs", label: "Choose Us", icon: <CheckCircleOutlined /> },
    { key: "colleagues", label: "Colleagues", icon: <TeamOutlined /> },
    { key: "course", label: "Course", icon: <ReadOutlined /> },
    { key: "gallery", label: "Gallery", icon: <GalleryIcon /> },
    { key: "news", label: "News", icon: <NotificationOutlined /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Управление главной страницей
          </h2>
          <p className="text-gray-500 mt-1">
            Настройте элементы, отображаемые на главной странице сайта
          </p>
        </div>
        
        <div className="flex gap-3">
          <Tooltip title="Предварительный просмотр">
            <Button icon={<EyeOutlined />} href="/" target="_blank">
              Просмотр
            </Button>
          </Tooltip>
          
          <Tooltip title={hasUnsavedChanges ? "Есть несохраненные изменения" : "Изменений нет"}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveChanges}
              disabled={!hasUnsavedChanges}
            >
              Сохранить
            </Button>
          </Tooltip>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Разделы главной страницы</h3>
          <Tooltip title="Порядок разделов соответствует их расположению на главной странице">
            <InfoCircleOutlined className="text-gray-400" />
          </Tooltip>
        </div>
        
        <Tabs
          activeKey={activeSection}
          onChange={setActiveSection}
          type="card"
          size="large"
          className="design-tabs"
        >
          {sections.map(section => (
            <TabPane
              tab={
                <span className="flex items-center">
                  {section.icon}
                  <span className="ml-2">{section.label}</span>
                </span>
              }
              key={section.key}
            />
          ))}
        </Tabs>
      </Card>

      <div className="relative">
        {hasUnsavedChanges && (
          <div className="absolute top-0 right-0 m-4 z-10">
            <Button
              type="default"
              icon={<UndoOutlined />}
              onClick={() => setHasUnsavedChanges(false)}
              size="small"
            >
              Отменить изменения
            </Button>
          </div>
        )}
        
        <Card
          title={
            <div className="flex items-center">
              {sections.find(s => s.key === activeSection)?.icon}
              <span className="ml-2">
                Настройка блока "{sections.find(s => s.key === activeSection)?.label}"
              </span>
            </div>
          }
          className="component-card overflow-visible"
        >
          {componentMap[activeSection]}
        </Card>
      </div>
      
      <div className="mt-6 text-right">
        <Divider />
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveChanges}
          disabled={!hasUnsavedChanges}
        >
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
};

export default DesignPage;

// Add this CSS to your global styles
/*
.design-tabs .ant-tabs-nav {
  margin-bottom: 20px;
}

.design-tabs .ant-tabs-tab {
  padding: 12px 16px;
  transition: all 0.3s;
}

.design-tabs .ant-tabs-tab:hover {
  background-color: #f0f5ff;
}

.design-tabs .ant-tabs-tab-active {
  background-color: #e6f7ff;
  border-bottom-color: #1890ff !important;
}

.component-card {
  min-height: 300px;
}
*/