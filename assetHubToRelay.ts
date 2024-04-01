/**
 * In this example we are creating a call to send 1 ROC from a AssetHub Rococo (System Parachain) account
 * to a Rococo (Relay Chain) account, where the `xcmVersion` is set to 2, and the `isLimited` declaring that
 * it will be `unlimited` since there is no `weightLimit` option as well.
 *
 * NOTE:
 *
 * - When `isLimited` is true it will use the `limited` version of the either `reserveAssetTransfer`, or `teleportAssets`.
 *
 * - Currently rococos asset-hub shares the same `specName` as kusamas asset-hub, therefore to use rococo you will need to hardcore the
 * `specName` value as `asset-hub-rococo` into the `AssetTransferApi`.
 * const assetApi = new AssetTransferApi(api, 'asset-hub-rococo', safeXcmVersion);
 */

/**
 * Option that specifies the format in which to return a transaction.
 * It can either be a `payload`, `call`, or `submittable`.
 *
 * Note: A `submittable` will return a `SubmittableExtrinsic` polkadot-js type, whereas
 * a `payload` or `call` will return a hex. By default a `payload` will be returned if nothing is inputted.
 */

const assetHubToRelay = async () => {
    const { AssetTransferApi, TxResult, constructApiPromise } = require('@substrate/asset-transfer-api');

	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://rococo-asset-hub-rpc.polkadot.io');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

    // let callInfo: TxResult<'call'>;
	let callInfo;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'0', // NOTE: The destination id is `0` noting that we are sending to the relay chain.
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['ROC'],
			['1000000000000'],
			{
				format: 'call',
				isLimited: true,
				xcmVersion: 2,
			},
		);

		console.log(callInfo);
	} catch (e) {
		console.error(e);
		throw Error(e);
	}

    const decoded = assetApi.decodeExtrinsic(callInfo.tx, 'call');
	console.log(`\nThe following decoded tx:\n${JSON.stringify(JSON.parse(decoded), null, 4)}`);
};

assetHubToRelay()
	.catch((err) => console.error(err))
	.finally(() => process.exit());