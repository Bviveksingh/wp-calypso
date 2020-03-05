/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';
import { requestActivityLogs } from 'state/data-getters';
import DatePicker from '../../components/date-picker';
import DailyBackupStatus from '../../components/daily-backup-status';
import { getBackupAttemptsForDate, getDailyBackupDeltas } from './utils';
import getRewindState from 'state/selectors/get-rewind-state';
import QueryRewindState from 'components/data/query-rewind-state';
import getSelectedSiteSlug from 'state/ui/selectors/get-selected-site-slug';
import { getSitePurchases } from 'state/purchases/selectors';
import QuerySitePurchases from 'components/data/query-site-purchases';
import BackupDelta from '../../components/backup-delta';
import { emptyFilter } from 'state/activity-log/reducer';


class BackupsPage extends Component {
	state = {
		currentDateSetting: false,
	};

	dateChange = currentDateSetting => this.setState( { currentDateSetting } );

	hasRealtimeBackups = () =>
		!! this.props.sitePurchases.filter(
			purchase => 'jetpack_backup_realtime' === purchase.productSlug
		).length;

	render() {
		const { allowRestore, logs, siteId, siteSlug } = this.props;
		const initialDate = new Date();
		const currentDateSetting = this.state.currentDateSetting
			? this.state.currentDateSetting
			: new Date().toISOString().split( 'T' )[ 0 ];

		const hasRealtimeBackups = this.hasRealtimeBackups();

		const backupAttempts = getBackupAttemptsForDate( logs, currentDateSetting );
		const deltas = getDailyBackupDeltas( logs, currentDateSetting );

		return (
			<div>
        <QueryRewindState siteId={ siteId } />
				<QuerySitePurchases siteId={ siteId } />
				<DatePicker siteId={ siteId } initialDate={ initialDate } onChange={ this.dateChange } />
								<DailyBackupStatus
					allowRestore={ allowRestore }
					date={ currentDateSetting }
					backupAttempts={ backupAttempts }
					siteSlug={ siteSlug }
				/>
				<BackupDelta deltas={ deltas } backupAttempts={ backupAttempts } />
				{ hasRealtimeBackups && <div>Real time backup points here</div> }
			</div>
		);
	}
}

export default connect( state => {
	const siteId = getSelectedSiteId( state );
	const logs = siteId && requestActivityLogs( siteId, emptyFilter );
	const sitePurchases = siteId && getSitePurchases( state, siteId );
  const rewind = getRewindState( state, siteId );
    const restoreStatus = rewind.rewind && rewind.rewind.status;
	const allowRestore =
		'active' === rewind.state && ! ( 'queued' === restoreStatus || 'running' === restoreStatus );

	return {
      allowRestore,
		sitePurchases,
		siteId,
		logs: logs?.data ?? [],
		rewind,
		siteId,
		siteSlug: getSelectedSiteSlug( state ),
	};
} )( BackupsPage );
