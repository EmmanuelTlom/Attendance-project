
// import useStore from '../store'
import helpers from './helpers'

export default {
  /**
   * Refresh state data
   * @param {*} force Pass parameter for states you want to forces refresh
   * E.g. {user: true, charts: true}
   */
  async initData (forced = { settings: false, charts: false, user: false, transactions: false, orders: false, subscriptions: false, savings: false, auth: false }) {

    let localState = { settings: [], charts: [], user: [], transactions: [], orders: { new: [], dispatched: [] }, subscriptions: [], savings: [] };
    let localCount = { settings: 0, charts: 0, user: 0, transactions: 0, orders: 0, subscriptions: 0, savings: 0 };
    let loadSettings, loadCharts, resetUserData, loadTransactions, loadOrders_new, loadOrders_dis, loadSubscriptions, loadSavings, loadUser = Promise.resolve(localState);

    const { state, getters, dispatch } = useStore();

    if (getters.config.settings.length === 0 || forced.settings) {
      loadSettings = dispatch('loadSettings');
    }

    if ((getters.getCharts.length === 0 || forced.charts) && getters.isLoggedIn) {
      loadCharts = dispatch('loadCharts');
    }

    // Load user data
    if ((getters.loggedUser === null || forced.user) && getters.isLoggedIn) {
      resetUserData = dispatch("resetUserData");
    }

    // Load auth user data
    if ((state.auth.userLoaded === false || forced.user || forced.auth) && getters.isLoggedIn) {
      loadUser = dispatch("auth/loadUser", !forced.auth ? getters.loggedUser : false);
    }

    // Load user transactions
    if ((state.auth.transactionsLoaded === false || forced.transactions) && getters.isLoggedIn) {
      loadTransactions = dispatch("auth/loadTransactions");
    }

    // Load user orders and dispaches
    if ((state.auth.ordersLoaded === false || forced.orders) && getters.isLoggedIn) {
      let loadOrders = { new: dispatch("auth/loadOrders"), dispatched: dispatch("auth/loadDispatched") };
      loadOrders_new = loadOrders.new
      loadOrders_dis = loadOrders.dispatched
    }

    // Load user subscriptions
    if ((state.auth.subscriptionsLoaded === false || forced.subscriptions) && getters.isLoggedIn) {
      loadSubscriptions = dispatch("auth/loadSubscriptions");
    }

    // Load user savings
    if ((state.auth.savingsLoaded === false || forced.savings) && getters.isLoggedIn) {
      loadSavings = dispatch("auth/loadSavings");
    }

    try {
      const [getSettings, getCharts, getUserData, getTransactions, getOrders_new, getOrders_dis, getSubscriptions, getSavings, getUser] = await Promise.all([
        loadSettings,
        loadCharts,
        resetUserData,
        loadTransactions,
        loadOrders_new,
        loadOrders_dis,
        loadSubscriptions,
        loadSavings,
        loadUser
      ]);
      localState.settings = getSettings;
      localState.charts = getCharts.charts;
      localState.user = getUserData.user;
      localState.transactions = getTransactions;
      localState.orders = { new: getOrders_new, dispatched: getOrders_dis };
      localState.subscriptions = getSubscriptions;
      localState.savings = getSavings;
    } catch (error) {
      error;
    }
    return localState;
  },
  loadActions () {
    return async (store) => {
      let localState = { settings: [], charts: [], user: [], transactions: [], subscriptions: [], savings: [] };
      let loadSettings, loadCharts, resetUserData, loadTransactions, loadOrders, loadSubscriptions, loadSavings = Promise.resolve(localState);

      if (store.getters.config.settings.length === 0) {
        loadSettings = store.dispatch('loadSettings');
      }

      if ((store.getters.getCharts.length === 0) && store.getters.isLoggedIn) {
        loadCharts = store.dispatch('loadCharts');
      }

      // Load user data
      if ((store.getters.loggedUser === null) && store.getters.isLoggedIn) {
        resetUserData = store.dispatch("resetUserData");
      }

      // Load user transactions
      if ((store.state.auth.transactionsLoaded === false) && store.getters.isLoggedIn) {
        loadTransactions = store.dispatch("auth/loadTransactions");
      }

      // Load user transactions
      if ((store.state.auth.ordersLoaded === false) && store.getters.isLoggedIn) {
        loadOrders = store.dispatch("auth/loadOrders");
      }

      // Load user subscriptions
      if ((store.state.auth.subscriptionsLoaded === false) && store.getters.isLoggedIn) {
        loadSubscriptions = store.dispatch("auth/loadSubscriptions");
      }

      // Load user savings
      if ((store.state.auth.savingsLoaded === false) && store.getters.isLoggedIn) {
        loadSavings = store.dispatch("auth/loadSavings");
      }

      try {
        const [getSettings, getCharts, getUserData, getTransactions, getOrders, getSubscriptions, getSavings] = await Promise.all([
          loadSettings,
          loadCharts,
          resetUserData,
          loadTransactions,
          loadOrders,
          loadSubscriptions,
          loadSavings
        ]);
        localState.settings = getSettings;
        localState.charts = getCharts ? getCharts.charts : [];
        localState.user = getUserData;
        localState.transactions = getTransactions;
        localState.orders = getOrders;
        localState.subscriptions = getSubscriptions;
        localState.savings = getSavings;
        return
      } catch (error) {
        return Promise.reject(error);
      }
    }
  },
  user (key, prefare_state = true, use_auth = true) {
    let user;
    if (typeof prefare_state === 'string') {
      user = JSON.parse(localStorage.getItem(prefare_state));
      user = use_auth === true ? user.auth.user : user
    } else {
      user = this.localState('auth', 'vuex', prefare_state ? 'auth/user' : null).user
    }
    if (key) {
      return user ? user[key] : null
    }
    return user
  },
  localState (key, index = 'vuex', getter) {
    let prop;
    if (getter) {
      const { getters } = useStore();
      let stored = getters[getter];
      prop = getter.split('/').pop()

      if (Object.keys(stored).length !== 0) {

        if (this.getKey) {
          prop = this.getKey
          delete this.getKey
        }
      }

      return {
        [prop]: stored
      }
    }

    let data = JSON.parse(localStorage.getItem(index));

    if (Object.keys(data).length !== 0 && key) {
      data = data[key]

      if (this.getKey) {
        data = data[this.getKey]
        prop = this.getKey
        delete this.getKey
      }

      if (getter) {
        return {
          [prop]: data
        }
      }
    }
    return data;
  },
  rsp (key) {
    if (key) {
      this.getKey = key
    }
    this.respond = true
    return this;
  },
  getResponse ( {data} , notice, toast = false) {
    console.log(data)
    data = (data ? data : '')
    let message = data ? data.message : '';
    let status = data ? data.status : 'error';

    if (notice) {
      return helpers.notify(message, (notice === true ? status : notice), !toast, action || "CLOSE");
    } else {
      if (this.respond === true) {
        data.status = status
        data.message = message
        return data;
      }
      return message;
    }
  }
}
