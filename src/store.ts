import Vue from 'vue'
import Vuex from 'vuex'

import { BreadCrumb, ColorScheme, Status, VisualizationPlugin } from '@/Globals'
import svnConfig from '@/svnConfig'

Vue.use(Vuex)

interface GlobalState {
  app: string
  debug: boolean
  authAttempts: number
  breadcrumbs: BreadCrumb[]
  credentials: { [url: string]: string }
  isFullScreen: boolean
  isDarkMode: boolean
  needLoginForUrl: string
  statusErrors: string[]
  statusMessage: string
  svnProjects: any[]
  visualizationTypes: Map<string, VisualizationPlugin>
  colorScheme: string
  locale: string
  runFolders: { [root: string]: { folder: string }[] }
  runFolderCount: number
  resizeEvents: number
  mapCamera: { bearing: number; center: number[]; pitch: number; zoom: number }
}

export default new Vuex.Store({
  state: {
    app: 'SIMdex / RunFinder', //  / afterSim / Scout', // 'S • C • O • U • T',
    debug: true,
    authAttempts: 0,
    breadcrumbs: [] as BreadCrumb[],
    credentials: { fake: 'fake' } as { [url: string]: string },
    isFullScreen: false,
    isDarkMode: false,
    needLoginForUrl: '',
    statusErrors: [] as string[],
    statusMessage: 'Loading',
    svnProjects: svnConfig.projects,
    visualizationTypes: new Map() as Map<string, VisualizationPlugin>,
    colorScheme: ColorScheme.LightMode,
    locale: 'en',
    runFolders: {},
    runFolderCount: 0,
    resizeEvents: 0,
    mapCamera: { center: [0, 0], pitch: 0, zoom: 5 },
  } as GlobalState,

  getters: {},
  mutations: {
    updateRunFolders(
      state: GlobalState,
      value: { number: number; folders: { [root: string]: { folder: string }[] } }
    ) {
      state.runFolderCount = value.number
      state.runFolders = value.folders
    },
    requestLogin(state: GlobalState, value: string) {
      state.needLoginForUrl = value
    },
    registerPlugin(state: GlobalState, value: VisualizationPlugin) {
      console.log('PLUGIN:', value.kebabName)
      state.visualizationTypes.set(value.kebabName, value)
    },
    setBreadCrumbs(state: GlobalState, value: BreadCrumb[]) {
      state.breadcrumbs = value
    },
    setCredentials(state: GlobalState, value: { url: string; username: string; pw: string }) {
      const creds = btoa(`${value.username}:${value.pw}`)
      state.credentials[value.url] = creds
      state.authAttempts++
    },
    setFullScreen(state: GlobalState, value: boolean) {
      state.isFullScreen = value
    },
    setMapCamera(state: GlobalState, { bearing, center, zoom, pitch }) {
      state.mapCamera = { bearing, center, zoom, pitch }
    },
    setStatus(state: GlobalState, value: { type: Status; msg: string }) {
      if (value.type === Status.INFO) {
        state.statusMessage = value.msg
      } else {
        if (
          // don't repeat yourself
          !state.statusErrors.length ||
          state.statusErrors[state.statusErrors.length - 1] !== value.msg
        ) {
          state.statusErrors.push(value.msg)
        }
      }
    },
    clearError(state: { statusErrors: any[] }, value: number) {
      if (state.statusErrors.length >= value) {
        state.statusErrors.splice(value, 1) // remove one element
      }
    },
    clearAllErrors(state: GlobalState) {
      state.statusErrors = []
    },
    resize(state: GlobalState) {
      state.resizeEvents += 1
    },
    rotateColors(state: GlobalState) {
      state.colorScheme =
        state.colorScheme === ColorScheme.DarkMode ? ColorScheme.LightMode : ColorScheme.DarkMode

      state.isDarkMode = state.colorScheme === ColorScheme.DarkMode

      console.log('NEW COLORS:', state.colorScheme)

      localStorage.setItem('colorscheme', state.colorScheme)

      document.body.style.backgroundColor =
        state.colorScheme === ColorScheme.LightMode ? '#edebe4' : '#2d3133'
    },
    setLocale(state: GlobalState, value: string) {
      state.locale = value.toLocaleLowerCase()
      localStorage.setItem('locale', state.locale)
      console.log('NEW LOCALE:', state.locale)
    },
  },
  actions: {},
  modules: {},
})
