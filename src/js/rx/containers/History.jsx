import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Scroll from 'react-scroll';
import _ from 'lodash';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import Pagination from '../../common/components/Pagination';
import SortableTable from '../../common/components/SortableTable';
import { loadPrescriptions } from '../actions/prescriptions';
import { openGlossaryModal } from '../actions/modals';

import GlossaryLink from '../components/GlossaryLink';
import SortMenu from '../components/SortMenu';
import { rxStatuses } from '../config';
import { formatDate } from '../utils/helpers';
import { getScrollOptions } from '../../common/utils/helpers';

const ScrollElement = Scroll.Element;
const scroller = Scroll.scroller;

class History extends React.Component {
  constructor(props) {
    super(props);
    this.formattedSortParam = this.formattedSortParam.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.renderPrescriptions = this.renderPrescriptions.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  componentDidMount() {
    if (!this.props.loading) {
      const query = _.pick(this.props.location.query, ['page', 'sort']);
      this.props.loadPrescriptions(query);
    }
  }

  componentDidUpdate(prevProps) {
    const currentPage = this.props.page;
    const currentSort = this.formattedSortParam(
      this.props.sort.value,
      this.props.sort.order
    );

    const query = _.pick(this.props.location.query, ['page', 'sort']);
    const requestedPage = +query.page || currentPage;
    const requestedSort = query.sort || currentSort;

    // Check if query params requested are different from state.
    const pageChanged = requestedPage !== currentPage;
    const sortChanged = requestedSort !== currentSort;

    if (pageChanged || sortChanged) {
      this.scrollToTop();
    }

    if (!this.props.loading) {
      if (pageChanged || sortChanged) {
        this.props.loadPrescriptions(query);
      }

      // Check if query params changed in state.
      const prevSort = this.formattedSortParam(
        prevProps.sort.value,
        prevProps.sort.order
      );
      const pageUpdated = prevProps.page !== currentPage;
      const sortUpdated = prevSort !== currentSort;

      if (pageUpdated || sortUpdated) {
        this.scrollToTop();
      }
    }
  }

  scrollToTop() {
    scroller.scrollTo('history', getScrollOptions());
  }

  formattedSortParam(value, order) {
    const formattedValue = _.snakeCase(value);
    const sort = order === 'DESC'
      ? `-${formattedValue}`
      : formattedValue;
    return sort;
  }

  handleSort(value, order) {
    const sort = this.formattedSortParam(value, order);
    this.context.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, sort }
    });
  }

  handlePageSelect(page) {
    this.context.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, page }
    });
  }

  renderPrescriptions() {
    const {
      page,
      pages,
      items: prescriptions,
      sort: currentSort
    } = this.props;

    if (!prescriptions.length) {
      return (
        <p className="rx-tab-explainer rx-loading-error">
          It looks like you have no past VA prescriptions in your records.
          If you think this is a mistake, please contact your health care team and ask them to check your prescription records.
          If you need more help, please call the Vets.gov Help Desk at 1-855-571-7286 (TTY: 1-800-829-4833).
          We’re here Monday - Friday, 8:00 a.m. - 8:00 p.m. (ET).
        </p>
      );
    }

    const fields = [
      { label: 'Last submit date', value: 'refillSubmitDate' },
      { label: 'Last fill date', value: 'refillDate' },
      { label: 'Prescription', value: 'prescriptionName' },
      { label: 'Prescription status', value: 'refillStatus', nonSortable: true },
    ];

    const data = prescriptions.map(item => {
      const attrs = item.attributes;
      const status = rxStatuses[attrs.refillStatus];

      return {
        id: item.id,

        refillSubmitDate: formatDate(attrs.refillSubmitDate),

        refillDate: formatDate(attrs.refillDate, { validateInPast: true }),

        prescriptionName: (
          <Link to={`/${attrs.prescriptionId}`}>
            {attrs.prescriptionName}
          </Link>
        ),

        refillStatus: (
          <GlossaryLink
            term={status}
            onClick={this.props.openGlossaryModal}/>
        )
      };
    });

    return (
      <div>
        <p className="rx-tab-explainer">Your VA prescription refill history</p>
        <div className="show-for-small-only">
          <SortMenu
            onClick={this.handleSort}
            onChange={this.handleSort}
            options={fields}
            selected={currentSort}/>
        </div>
        <SortableTable
          className="usa-table-borderless va-table-list rx-table rx-table-list"
          currentSort={currentSort}
          data={data}
          fields={fields}
          onSort={this.handleSort}/>
        <Pagination
          onPageSelect={this.handlePageSelect}
          page={page}
          pages={pages}/>
      </div>
    );
  }

  renderContent() {
    const { loading, items: prescriptions } = this.props;

    if (loading) {
      return <LoadingIndicator message="Loading your prescriptions..."/>;
    }

    if (prescriptions) {
      return this.renderPrescriptions();
    }

    return (
      <p className="rx-tab-explainer rx-loading-error">
        We couldn’t retrieve your prescriptions.
        Please refresh this page or try again later. If this problem persists, please call the Vets.gov Help Desk
        at 1-855-574-7286 (TTY: 1-800-829-4833).
        We’re here Monday - Friday, 8:00 a.m. - 8:00 p.m. (ET).
      </p>
    );
  }

  render() {
    return (
      <ScrollElement
        id="rx-history"
        name="history"
        className="va-tab-content">
        {this.renderContent()}
      </ScrollElement>
    );
  }
}

History.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  const rxState = state.health.rx;
  return rxState.prescriptions.history;
};

const mapDispatchToProps = {
  loadPrescriptions,
  openGlossaryModal
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
