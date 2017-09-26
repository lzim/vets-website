import { set } from 'lodash/fp';
import _ from 'lodash';

const initialState = {
  active: {
    items: null,
    loading: false,
    sort: {
      value: 'prescriptionName',
      order: 'ASC',
    },
  },
  history: {
    items: null,
    loading: false,
    sort: {
      value: 'refillSubmitDate',
      order: 'DESC',
    },
    page: 1,
    pages: 1
  },
  prescription: {
    data: null,
    loading: false,
    trackings: null
  }
};

function sortByName(items) {
  /*
  Making all values the same case, to prevent
  alphabetization from getting wonky.
  */
  return items.attributes.prescriptionName.toLowerCase();
}

function sortByFacilityName(items) {
  return items.attributes.facilityName;
}

function sortByLastSubmitDate(items) {
  return new Date(items.attributes.refillSubmitDate).getTime();
}

function sortByLastFillDate(items) {
  return new Date(items.attributes.refillDate).getTime();
}

function updateRefillStatus(items, id) {
  const itemToUpdate = items.findIndex((item) => {
    // The + converts to a number for comparison
    return +item.id === id;
  });

  // Update the refill status
  const isRefillable = set('attributes.isRefillable', false, items[itemToUpdate]);
  const refillStatus = set('attributes.refillStatus', 'submitted', isRefillable);

  const updatedItems = set(itemToUpdate, refillStatus, items);

  return updatedItems;
}

export default function prescriptions(state = initialState, action) {
  switch (action.type) {
    case 'LOADING_ACTIVE':
      return set('active.loading', true, state);

    case 'LOADING_HISTORY':
      return set('history.loading', true, state);

    case 'LOADING_PRESCRIPTION':
      return set('prescription.loading', true, state);

    case 'LOAD_PRESCRIPTION_FAILURE': {
      return set('prescription', {
        data: null,
        loading: false,
        trackings: null
      }, state);
    }

    case 'LOAD_PRESCRIPTIONS_FAILURE': {
      const section = action.active ? 'active' : 'history';
      return set(section, {
        errors: action.errors || [],
        items: null,
        loading: false
      }, state);
    }

    case 'LOAD_PRESCRIPTION_SUCCESS': {
      return set('prescription', {
        loading: false,
        ...action.prescription
      }, state);
    }

    case 'LOAD_PRESCRIPTIONS_SUCCESS': {
      const sort = action.data.meta.sort;
      const sortValue = Object.keys(sort)[0];
      const sortOrder = sort[sortValue];
      const pagination = action.data.meta.pagination;

      const newState = {
        items: action.data.data,
        loading: false,
        sort: { value: sortValue, order: sortOrder },
        page: pagination.currentPage,
        pages: pagination.totalPages
      };

      return set(action.active ? 'active' : 'history', newState, state);
    }

    case 'REFILL_SUCCESS': {
      const newItems = updateRefillStatus(state.items, action.prescription.prescriptionId);
      return set('items', newItems, state);
    }

    case 'SORT_PRESCRIPTIONS': {
      const newState = set('active.sort', {
        value: action.sort,
        order: action.order,
      }, state);
      const order = action.order.toLowerCase();

      switch (action.sort) {
        case 'prescriptionName':
          return set('items', _.orderBy(state.items, sortByName, [order]), newState);
        case 'facilityName':
          return set('items', _.orderBy(state.items, sortByFacilityName, [order]), newState);
        case 'lastSubmitDate':
          return set('items', _.orderBy(state.items, sortByLastSubmitDate, [order]), newState);
        case 'lastFillDate':
          return set('items', _.orderBy(state.items, sortByLastFillDate, [order]), newState);
        default:
          return set('active.sort', {
            value: 'prescriptionName',
            order: 'ASC',
          }, state);
      }
    }

    default:
      return state;
  }
}
