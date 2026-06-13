import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Blog from '../views/Blog.vue'
import BlogPost from '../views/BlogPost.vue'
import Contact from '../views/Contact.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import Login from '../views/admin/Login.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import PostList from '../views/admin/PostList.vue'
import PostEditor from '../views/admin/PostEditor.vue'
import CategoryManage from '../views/admin/CategoryManage.vue'
import ImportMD from '../views/admin/ImportMD.vue'
import ImportZip from '../views/admin/ImportZip.vue'
import Setup from '../views/admin/Setup.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/blog', name: 'blog', component: Blog },
  { path: '/blog/:slug', name: 'blog-post', component: BlogPost },
  { path: '/contact', name: 'contact', component: Contact },
  { path: '/admin/login', name: 'admin-login', component: Login },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'admin', component: Dashboard },
      { path: 'posts', name: 'admin-posts', component: PostList },
      { path: 'posts/new', name: 'admin-post-new', component: PostEditor },
      { path: 'posts/:id/edit', name: 'admin-post-edit', component: PostEditor },
      { path: 'categories', name: 'admin-categories', component: CategoryManage },
      { path: 'import', name: 'admin-import', component: ImportMD },
      { path: 'import-zip', name: 'admin-import-zip', component: ImportZip },
      { path: 'setup', name: 'admin-setup', component: Setup },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
