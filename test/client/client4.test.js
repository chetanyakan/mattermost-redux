// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import assert from 'assert';
import nock from 'nock';

import Client4, {HEADER_X_VERSION_ID} from 'client/client4';
import {DEFAULT_SERVER} from 'test/test_helper';
import {isMinimumServerVersion} from 'utils/helpers';

describe('Client4', () => {
    describe('doFetchWithResponse', () => {
        it('serverVersion should be set from response header', async () => {
            const client = new Client4();
            client.setUrl(DEFAULT_SERVER);

            assert.equal(client.serverVersion, '');

            nock(client.getUrl()).
                get('/api/v4/users/me').
                reply(200, '{}', {[HEADER_X_VERSION_ID]: '5.0.0.5.0.0.abc123'});

            await client.getMe();

            assert.equal(client.serverVersion, '5.0.0.5.0.0.abc123');
            assert.equal(isMinimumServerVersion(client.serverVersion, 5, 0, 0), true);
            assert.equal(isMinimumServerVersion(client.serverVersion, 5, 1, 0), false);

            nock(client.getUrl()).
                get('/api/v4/users/me').
                reply(200, '{}', {[HEADER_X_VERSION_ID]: '5.3.0.5.3.0.abc123'});

            await client.getMe();

            assert.equal(client.serverVersion, '5.3.0.5.3.0.abc123');
            assert.equal(isMinimumServerVersion(client.serverVersion, 5, 0, 0), true);
            assert.equal(isMinimumServerVersion(client.serverVersion, 5, 1, 0), true);
        });
    });
});
