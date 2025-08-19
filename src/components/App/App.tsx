import '@mantine/core/styles.css';

import React, { useState } from 'react';
import {
  IconCalendarWeek,
  IconSettings,
  IconShoppingCart,
  IconToolsKitchen2,
} from '@tabler/icons-react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ActionIcon, Divider, Flex, Tabs, Text, ThemeIcon, Title } from '@mantine/core';
import SettingsModal from '@/components/SettingsModal';
import ThemeProvider from '@/components/ThemeProvider';
import MealPlanPage from '@/pages/MealPlan';
import RecipesPage from '@/pages/Recipes';
import ShoppingListPage from '@/pages/ShoppingList';
import MealPlanProvider from '@/providers/MealPlanProvider';
import RecipeProvider from '@/providers/RecipeProvider';
import ShoppingListProvider from '@/providers/ShoppingListProvider';

const App: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [displaySettingsModal, setDisplaySettingsModal] = useState(false);

  const openSettingsModal = () => {
    setDisplaySettingsModal(true);
  };

  const closeSettingsModal = () => {
    setDisplaySettingsModal(false);
  };

  const currentRoute = routes.find((route) => route.path === location.pathname);

  return (
    <ThemeProvider>
      <ShoppingListProvider>
        <RecipeProvider>
          <MealPlanProvider>
            <Flex direction="column" h="100svh">
              <Flex px="md" py="xs" align="center">
                <Title order={2} fw={600} c="gray">
                  {currentRoute?.name}
                </Title>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  ml="auto"
                  onClick={openSettingsModal}
                >
                  <IconSettings size={16} />
                </ActionIcon>
              </Flex>
              <Routes>
                {routes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
                <Route path="*" element={<Navigate to={routes[0].path} />} />
              </Routes>
              <Tabs value={currentRoute?.path} onChange={(route) => route && navigate(route)}>
                <Divider />
                <Tabs.List justify="center" grow>
                  {routes.map((route) => (
                    <Tabs.Tab key={route.path} value={route.path}>
                      <Flex direction="column" justify="center" align="center">
                        <ThemeIcon variant="subtle" color="gray" size="sm">
                          {route.icon}
                        </ThemeIcon>
                        <Text size="sm" tt="lowercase" c="gray" fw={600}>
                          {route.name}
                        </Text>
                      </Flex>
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs>
            </Flex>
            <SettingsModal open={displaySettingsModal} onClose={closeSettingsModal} />
          </MealPlanProvider>
        </RecipeProvider>
      </ShoppingListProvider>
    </ThemeProvider>
  );
};

export default App;

const routes = [
  {
    name: 'Meals',
    path: '/meals',
    icon: <IconCalendarWeek size={24} />,
    element: <MealPlanPage />,
  },
  {
    name: 'Recipes',
    path: '/recipes',
    icon: <IconToolsKitchen2 size={24} />,
    element: <RecipesPage />,
  },
  {
    name: 'Shopping',
    path: '/shopping',
    icon: <IconShoppingCart size={24} />,
    element: <ShoppingListPage />,
  },
];
