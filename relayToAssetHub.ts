/**
 * In this example we are creating a call to send 1 ROC from a Rococo (Relay Chain) account
 * to a AssetHub Rococo (System Parachain) account, where the `xcmVersion` is set to 2, and the `isLimited` declaring that
 * it will be `unlimited` since there is no `weightLimit` option as well.
 *
 * NOTE: When `isLimited` is true it will use the `limited` version of the either `reserveAssetTransfer`, or `teleportAssets`.
 */

/**
 * Option that specifies the format in which to return a transaction.
 * It can either be a `payload`, `call`, or `submittable`.
 *
 * Note: A `submittable` will return a `SubmittableExtrinsic` polkadot-js type, whereas
 * a `payload` or `call` will return a hex. By default a `payload` will be returned if nothing is inputted.
 */

const relayToAssetHub = async () => {
    const { AssetTransferApi, TxResult, constructApiPromise } = require('@substrate/asset-transfer-api');

	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://rococo-rpc.polkadot.io');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

    // let callInfo: TxResult<'call'>;
	let callInfo;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1000', // Specify parachain system ID
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['ROC'],
			['1000000000000'],
			{
				format: 'call',
				isLimited: true,
				xcmVersion: 2,
			},
		);
	} catch (e) {
		console.error(e);
		throw Error(e);
	}

    const decoded = assetApi.decodeExtrinsic(callInfo.tx, 'call');
	console.log(`\n$The following decoded tx:\n ${JSON.stringify(JSON.parse(decoded), null, 4)}`);
};

relayToAssetHub()
	.catch((err) => console.error(err))
	.finally(() => process.exit());