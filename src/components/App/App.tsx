import '@mantine/core/styles.css';

import React, { useState } from 'react';
import {
  IconCalendarWeek,
  IconMoon,
  IconShoppingCart,
  IconSun,
  IconSunMoon,
  IconToolsKitchen2,
} from '@tabler/icons-react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Divider,
  Flex,
  MantineProvider,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import MealPlanPage from '@/pages/MealPlan';
import RecipesPage from '@/pages/Recipes';
import ShoppingListPage from '@/pages/ShoppingList';
import MealPlanProvider from '@/providers/MealPlanProvider';
import RecipeProvider from '@/providers/RecipeProvider';
import ShoppingListProvider from '@/providers/ShoppingListProvider';
import { theme } from '@/theme';

const App: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [colorScheme, setColorScheme] = useState<ColorScheme>();

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : colorScheme === 'dark' ? undefined : 'light');
  };

  const currentRoute = routes.find((route) => route.path === location.pathname);

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto" forceColorScheme={colorScheme}>
      <ShoppingListProvider>
        <RecipeProvider>
          <MealPlanProvider>
            <Flex direction="column" h="100vh ">
              <Flex px="md" py="xs" align="center">
                <Title order={2} fw={600} c="gray">
                  {currentRoute?.name}
                </Title>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  ml="auto"
                  onClick={toggleColorScheme}
                >
                  {colorScheme === 'light' ? (
                    <IconMoon size={16} />
                  ) : colorScheme === 'dark' ? (
                    <IconSunMoon size={16} />
                  ) : (
                    <IconSun size={16} />
                  )}
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
          </MealPlanProvider>
        </RecipeProvider>
      </ShoppingListProvider>
    </MantineProvider>
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

type ColorScheme = 'light' | 'dark';
