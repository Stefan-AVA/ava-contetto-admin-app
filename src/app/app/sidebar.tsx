"use client"

import { useState } from "react"
import { Route } from "next"
import { useRouter } from "next/navigation"
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
} from "@mui/material"
import { CSSObject, styled, Theme } from "@mui/material/styles"
import { ChevronLeft, Home, LayoutTemplate, Menu } from "lucide-react"

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}))

const routes = [
  {
    path: "/app",
    icon: Home,
    label: "Home",
  },
  {
    path: "/app/templates",
    icon: LayoutTemplate,
    label: "Templates",
  },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  const { push } = useRouter()

  function handleDrawer() {
    setOpen((prev) => !prev)
  }

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleDrawer}
          aria-label="Toggle drawer"
        >
          {!open ? <Menu /> : <ChevronLeft />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {routes.map(({ path, icon: Icon, label }) => (
          <ListItem
            sx={{ display: "block" }}
            key={path}
            disablePadding
            onClick={() => push(path as Route)}
          >
            <ListItemButton
              sx={{
                px: 2.5,
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <Icon />
              </ListItemIcon>
              <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
