// @flow

import React, { Component } from 'react';
import PNotify from 'pnotify/dist/umd/PNotify';
import { BeatLoader as Loader } from 'react-spinners';

import Sites from 'components/Sites/Sites';

import STATUS from 'configs/Status';
import ERROR from 'configs/Error';

import type { Site as SiteType } from 'components/Sites/Site.type';
import type { onSiteRowRemove as onSiteRowRemoveType } from 'components/Sites/onSiteRowRemove.type';


type SitesData = Array<SiteType>;

type State = {
  loading: boolean,
  sites: SitesData,
};

type Props = {
};

class SitesContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      sites: [],
    };

    this.onSiteRowRemove = this.onSiteRowRemove.bind(this);
  }

  componentDidMount() {
    const request = new Request('/users/current/sites');
    fetch(request)
      .then((response: Response) => {
        if (response.ok) {
          return response.json();
        } else {
          // TODO resolve past next handler
          // TODO change error message
          PNotify.alert({
            text: ERROR.unexpected,
            type: STATUS.error,
            delay: 2000,
          });

          return Promise.resolve(null);
        }
      })
      .then((sites: ?SitesData = []) => {
        this.setState(() => {
          return {
            loading: false,
            sites: sites,
          };
        });
      })
      .catch(() => {
        this.setState(() => {
          return {
            loading: false,
          };
        }, () => {
          PNotify.alert({
            text: ERROR.unexpected,
            type: STATUS.error,
            delay: 2000,
          });
        });
      });
  }

  onSiteRowRemove: onSiteRowRemoveType = (e: Event, site: SiteType) => {
    const request: Request = new Request('/users/current/sites', {
      method: 'DELETE',
    });
    fetch(request)
      .then((response: Response) => {
        if (response.ok) {
          this.setState((prevState) => {
            const sitesFiltered = prevState.sites.filter(({ title, url }) => {
              return title !== site.title && url !== site.url;
            });

            return {
              sites: sitesFiltered,
            };
          });
        } else {
          // TODO change error type
          PNotify.alert({
            text: ERROR.unexpected,
            type: STATUS.error,
            delay: 2000,
          });
        }
      })
      .catch(() => {
        // TODO wrapper on this for general case?
        PNotify.alert({
          text: ERROR.unexpected,
          type: STATUS.error,
          delay: 2000,
        });
      });
  }

  render() {
    const {
      sites,
      loading,
    } = this.state;

    return (
      <React.Fragment>
        <Loader
          loading={loading}
        />
        {!loading &&
          (
            <Sites
              sites={sites}
              onSiteRowRemove={this.onSiteRowRemove}
            />
          )
        }
      </React.Fragment>
    );
  }
}

export default SitesContainer;