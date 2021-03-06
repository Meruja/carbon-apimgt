/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import ChipInput from 'material-ui-chip-input';
import ContentBase from 'AppComponents/AdminPages/Addons/ContentBase';
import { useIntl, FormattedMessage } from 'react-intl';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Link as RouterLink } from 'react-router-dom';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    Typography, FormControlLabel, MenuItem,
} from '@material-ui/core';
import API from 'AppData/api';
import Alert from 'AppComponents/Shared/Alert';
import { useAppContext } from 'AppComponents/Shared/AppContext';
import cloneDeep from 'lodash.clonedeep';
import Button from '@material-ui/core/Button';
import KeyValidations from 'AppComponents/KeyManagers/KeyValidations';
import isEmpty from 'lodash.isempty';
import AddCircle from '@material-ui/icons/AddCircle';
import KeyManagerConfiguration from './KeyManagerConfiguration';
import ClaimMappings from './ClaimMapping';

const useStyles = makeStyles((theme) => ({
    error: {
        color: theme.palette.error.dark,
    },
    dialog: {
        minWidth: theme.spacing(100),

    },
}));


/**
 * Reducer
 * @param {JSON} state The second number.
 * @returns {Promise}
 */
function reducer(state, newValue) {
    const { field, value } = newValue;
    switch (field) {
        case 'name':
        case 'description':
        case 'type':
        case 'introspectionEndpoint':
        case 'clientRegistrationEndpoint':
        case 'tokenEndpoint':
        case 'revokeEndpoint':
        case 'userInfoEndpoint':
        case 'authorizeEndpoint':
        case 'jwksEndpoint':
        case 'issuer':
        case 'scopeManagementEndpoint':
        case 'enableTokenGeneration':
        case 'enableMapOAuthConsumerApps':
        case 'enableOAuthAppCreation':
        case 'enableSelfValidationJWT':
        case 'claimMapping':
        case 'additionalProperties':
        case 'availableGrantTypes':
        case 'tokenValidation':
        case 'displayName':
        case 'consumerKeyClaim':
        case 'scopesClaim':
            return { ...state, [field]: value };
        case 'all':
            return value;
        default:
            return newValue;
    }
}

/**
 * Render a list
 * @returns {JSX} Header AppBar components.
 */
function AddEditKeyManager(props) {
    const classes = useStyles();
    const intl = useIntl();
    const { match: { params: { id } } } = props;

    const [initialState] = useState({
        name: '',
        description: '',
        displayName: '',
        type: '',
        introspectionEndpoint: '',
        clientRegistrationEndpoint: '',
        tokenEndpoint: '',
        revokeEndpoint: '',
        userInfoEndpoint: '',
        authorizeEndpoint: '',
        jwksEndpoint: '',
        issuer: '',
        scopeManagementEndpoint: '',
        availableGrantTypes: [],
        enableTokenGeneration: true,
        enableMapOAuthConsumerApps: true,
        enableOAuthAppCreation: true,
        enableSelfValidationJWT: true,
        claimMapping: [],
        tokenValidation: [],
        enabled: true,
        scopesClaim: '',
        consumerKeyClaim: '',
        additionalProperties: {},
    });
    const { settings } = useAppContext();
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        name, description, type, displayName,
        introspectionEndpoint, clientRegistrationEndpoint,
        tokenEndpoint, revokeEndpoint,
        userInfoEndpoint, authorizeEndpoint,
        jwksEndpoint, issuer, scopeManagementEndpoint, availableGrantTypes, consumerKeyClaim, scopesClaim,
        enableTokenGeneration, enableMapOAuthConsumerApps,
        enableOAuthAppCreation, enableSelfValidationJWT, claimMapping, tokenValidation, additionalProperties,
    } = state;
    const [validationError, setValidationError] = useState([]);
    const [editMode, setIsEditMode] = useState(false);
    const [keymanagerConnectorConfigurations, setKeyManagerConfiguration] = useState([]);
    const restApi = new API();
    const updateKeyManagerConnectorConfiguration = (keyManagerType) => {
        if (settings.keyManagerConfiguration) {
            settings.keyManagerConfiguration.map(({ type: key, configurations }) => {
                if (key === keyManagerType) {
                    setKeyManagerConfiguration(configurations);
                    return true;
                } else {
                    return false;
                }
            });
        }
    };
    useEffect(() => {
        restApi.keyManagerGet(id).then((result) => {
            let editState;
            if (result.body.name !== null) {
                editState = {
                    name: result.body.name,
                    description: result.body.description,
                    type: result.body.type,
                    displayName: result.body.displayName,
                    introspectionEndpoint: result.body.introspectionEndpoint,
                    clientRegistrationEndpoint: result.body.clientRegistrationEndpoint,
                    tokenEndpoint: result.body.tokenEndpoint,
                    revokeEndpoint: result.body.revokeEndpoint,
                    userInfoEndpoint: result.body.userInfoEndpoint,
                    authorizeEndpoint: result.body.authorizeEndpoint,
                    jwksEndpoint: result.body.jwksEndpoint,
                    issuer: result.body.issuer,
                    scopeManagementEndpoint: result.body.scopeManagementEndpoint,
                    availableGrantTypes: result.body.availableGrantTypes,
                    enableTokenGeneration: result.body.enableTokenGeneration,
                    enableMapOAuthConsumerApps: result.body.enableMapOAuthConsumerApps,
                    enableOAuthAppCreation: result.body.enableOAuthAppCreation,
                    enableSelfValidationJWT: result.body.enableSelfValidationJWT,
                    claimMapping: result.body.claimMapping,
                    tokenValidation: result.body.tokenValidation,
                    enabled: result.body.enabled,
                    scopesClaim: result.body.scopesClaim,
                    consumerKeyClaim: result.body.consumerKeyClaim,
                    additionalProperties: result.body.additionalProperties,
                };
            }
            dispatch({ field: 'all', value: editState });
            updateKeyManagerConnectorConfiguration(editState.type);
            setIsEditMode(true);
        });
    }, []);

    const validate = (fieldName, value) => {
        let error = '';
        switch (fieldName) {
            case 'name':
                if (value === '') {
                    error = 'Name is Empty';
                } else if (value.indexOf(' ') !== -1) {
                    error = 'Name contains spaces';
                } else {
                    error = '';
                }
                setValidationError({ name: error });
                break;
            default:
                break;
        }
        return error;
    };

    const onChange = (e) => {
        if (e.target.type === 'checkbox') {
            dispatch({ field: e.target.name, value: e.target.checked });
        } else {
            if (e.target.name === 'type') {
                updateKeyManagerConnectorConfiguration(e.target.value);
            }
            dispatch({ field: e.target.name, value: e.target.value });
        }
    };

    const getAllFormErrors = () => {
        const nameErrors = validate('name', name);
        return nameErrors;
    };

    const formSaveCallback = () => {
        const formErrors = getAllFormErrors();
        if (formErrors !== '') {
            Alert.error(formErrors);
            return (false);
        }
        let promisedAddKeyManager;

        const keymanager = {
            name: state.name,
            description: state.description,
            type: state.type,
            displayName: state.displayName,
            introspectionEndpoint: state.introspectionEndpoint,
            clientRegistrationEndpoint: state.clientRegistrationEndpoint,
            tokenEndpoint: state.tokenEndpoint,
            revokeEndpoint: state.revokeEndpoint,
            userInfoEndpoint: state.userInfoEndpoint,
            authorizeEndpoint: state.authorizeEndpoint,
            jwksEndpoint: state.jwksEndpoint,
            issuer: state.issuer,
            scopeManagementEndpoint: state.scopeManagementEndpoint,
            availableGrantTypes: state.availableGrantTypes,
            enableTokenGeneration: state.enableTokenGeneration,
            enableMapOAuthConsumerApps: state.enableMapOAuthConsumerApps,
            enableOAuthAppCreation: state.enableOAuthAppCreation,
            enableSelfValidationJWT: state.enableSelfValidationJWT,
            claimMapping: state.claimMapping,
            tokenValidation: state.tokenValidation,
            enabled: state.enabled,
            consumerKeyClaim: state.consumerKeyClaim,
            scopesClaim: state.scopesClaim,
            additionalProperties: state.additionalProperties,
        };

        if (editMode) {
            promisedAddKeyManager = restApi.updateKeyManager(id,
                keymanager);
            return promisedAddKeyManager
                .then(() => {
                    return (
                        <FormattedMessage
                            id='KeyManager.edit.success'
                            defaultMessage='Key Manager edited successfully.'
                        />
                    );
                })
                .catch((error) => {
                    const { response } = error;
                    if (response.body) {
                        throw (response.body.description);
                    }
                    return null;
                });
        } else {
            promisedAddKeyManager = restApi.addKeyManager(keymanager);
            return promisedAddKeyManager
                .then(() => {
                    return true;

                    // return (
                    //     <FormattedMessage
                    //         id='KeyManager.add.success'
                    //         defaultMessage='Key Manager added successfully.'
                    //     />
                    // );
                })
                .catch((error) => {
                    const { response } = error;
                    if (response.body) {
                        throw (response.body.description);
                    }
                    return null;
                });
        }
    };
    const setClaimMapping = (updatedClaimMappings) => {
        dispatch({ field: 'claimMapping', value: updatedClaimMappings });
    };
    const setAdditionalProperties = (key, value) => {
        const clonedAdditionalProperties = cloneDeep(additionalProperties);
        clonedAdditionalProperties[key] = value;
        dispatch({ field: 'additionalProperties', value: clonedAdditionalProperties });
    };
    const addTokenValidation = () => {
        const tokenValidationId = tokenValidation.length + 1;
        const emptyTokenValidation = {
            id: tokenValidationId, type: '', value: '', enable: true,
        };
        const tokenValidationClone = cloneDeep(tokenValidation);
        tokenValidationClone.push(emptyTokenValidation);
        dispatch({ field: 'tokenValidation', value: tokenValidationClone });
    };
    const setTokenValidations = (value) => {
        dispatch({ field: 'tokenValidation', value });
    };
    return (
        <ContentBase
            pageStyle='half'
            title={
                intl.formatMessage({
                    id: 'Keymanagers.Create.new',
                    defaultMessage: 'KeyManager - Create new',
                })
            }
            help={<div />}
        >
            <Box component='div' m={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={6}>
                        <Typography color='inherit' variant='subtitle2' component='div'>
                            <FormattedMessage
                                id='Admin.KeyManager.form.details'
                                defaultMessage='Details'
                            />
                        </Typography>
                        <Box component='div' m={1}>
                            <TextField
                                autoFocus
                                margin='dense'
                                name='name'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Name'
                                        defaultMessage='Name'
                                    />
                                )}
                                fullWidth
                                required
                                variant='outlined'
                                value={name}
                                disabled={editMode}
                                onChange={onChange}
                                InputProps={{
                                    id: 'name',
                                    onBlur: ({ target: { value } }) => {
                                        validate('name', value);
                                    },
                                }}
                                error={validationError.name}
                                helperText={validationError.name && validationError.name}
                            />
                            <TextField
                                margin='dense'
                                name='displayName'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.DisplayName'
                                        defaultMessage='Display Name'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={displayName}
                                onChange={onChange}
                            />

                            <TextField
                                margin='dense'
                                name='description'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Description'
                                        defaultMessage='Description'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={description}
                                onChange={onChange}
                            />

                            <TextField
                                classes={{
                                    root: classes.mandatoryStarSelect,
                                }}
                                required
                                fullWidth
                                id='outlined-select-currency'
                                select
                                label={(
                                    <FormattedMessage
                                        defaultMessage='KeyManager Type'
                                        id='Admin.KeyManager.Type'
                                    />
                                )}
                                value={type}
                                name='type'
                                onChange={onChange}
                                helperText={(
                                    <FormattedMessage
                                        defaultMessage='Select Key Manager Type to configure'
                                        id='Admin.KeyManager.Type.helper'
                                    />
                                )}
                                margin='normal'
                                variant='outlined'
                            >
                                {settings.keyManagerConfiguration.map((keymanager) => (
                                    <MenuItem key={keymanager.type} value={keymanager.type} onChange={onChange}>
                                        {keymanager.type}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                margin='dense'
                                name='clientRegistrationEndpoint'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.ClientRegistration.Endpoint'
                                        defaultMessage='Client Registration Endpoint'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={clientRegistrationEndpoint}
                                onChange={onChange}
                            />
                            <TextField
                                margin='dense'
                                name='introspectionEndpoint'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Introspection.Endpoint'
                                        defaultMessage='Introspection Endpoint'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={introspectionEndpoint}
                                onChange={onChange}
                            />
                            <TextField
                                margin='dense'
                                name='tokenEndpoint'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Token.Endpoint'
                                        defaultMessage='Token Endpoint'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={tokenEndpoint}
                                onChange={onChange}
                            />
                            <TextField
                                margin='dense'
                                name='revokeEndpoint'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Revoke.Endpoint'
                                        defaultMessage='Revoke Endpoint'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={revokeEndpoint}
                                onChange={onChange}
                            />
                            <TextField
                                margin='dense'
                                name='userInfoEndpoint'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.UserInfo.Endpoint'
                                        defaultMessage='UserInfo Endpoint'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={userInfoEndpoint}
                                onChange={onChange}
                            />
                            <TextField
                                margin='dense'
                                name='authorizeEndpoint'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Authorize.Endpoint'
                                        defaultMessage='Authorize Endpoint'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={authorizeEndpoint}
                                onChange={onChange}
                            />
                            <TextField
                                margin='dense'
                                name='jwksEndpoint'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.JWKS.Endpoint'
                                        defaultMessage='JWKS Endpoint'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={jwksEndpoint}
                                onChange={onChange}
                            />
                            <TextField
                                margin='dense'
                                name='issuer'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Issuer'
                                        defaultMessage='Issuer'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={issuer}
                                onChange={onChange}
                            />

                            <TextField
                                margin='dense'
                                name='scopeManagementEndpoint'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Scope.Endpoint'
                                        defaultMessage='Scope Management Endpoint'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={scopeManagementEndpoint}
                                onChange={onChange}
                            />
                            <TextField
                                margin='dense'
                                name='consumerKeyClaim'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.ConsumerKey.Claim'
                                        defaultMessage='ConsumerKey Claim URI'
                                    />
                                )}
                                fullWidth
                                variant='outlined'
                                value={consumerKeyClaim}
                                onChange={onChange}
                            />
                            <TextField
                                margin='dense'
                                name='scopesClaim'
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Scopes.Claim'
                                        defaultMessage='Scopes Claim URI'
                                    />
                                )}

                                fullWidth
                                variant='outlined'
                                value={scopesClaim}
                                onChange={onChange}
                            />

                            <ChipInput
                                style={{ marginBottom: 40, display: 'flex' }}
                                value={availableGrantTypes}
                                helperText={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.AvailableGrants.helper'
                                        defaultMessage='Type Available Grant Types'
                                    />
                                )}
                                onAdd={(grantType) => {
                                    availableGrantTypes.push(grantType);
                                }}
                                onDelete={(grantToDelete) => {
                                    const filteredGrantTypes = availableGrantTypes.filter(
                                        (grantType) => grantType !== grantToDelete,
                                    );
                                    dispatch({ field: 'availableGrantTypes', value: filteredGrantTypes });
                                }}
                            />
                            <FormControlLabel
                                value='EnableTokenGeneration'
                                control={(
                                    <Checkbox
                                        checked={enableTokenGeneration}
                                        onChange={onChange}
                                        name='enableTokenGeneration'
                                        color='primary'
                                    />
                                )}
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Enable.TokenGen'
                                        defaultMessage='Enable Token Generation'
                                    />
                                )}
                                labelPlacement='start'
                            />
                            <FormControlLabel
                                value='enableMapOAuthConsumerApps'
                                control={(
                                    <Checkbox
                                        checked={enableMapOAuthConsumerApps}
                                        onChange={onChange}
                                        name='enableMapOAuthConsumerApps'
                                        color='primary'
                                    />
                                )}
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Enable.OutOfBandProvisioning'
                                        defaultMessage='Enable Out Of Band Provisioning'
                                    />
                                )}
                                labelPlacement='start'
                            />
                            <FormControlLabel
                                value='enableOAuthAppCreation'
                                control={(
                                    <Checkbox
                                        checked={enableOAuthAppCreation}
                                        onChange={onChange}
                                        name='enableOAuthAppCreation'
                                        color='primary'
                                    />
                                )}
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Enable.EnableOAithAppCreation'
                                        defaultMessage='Enable Oauth App Creation'
                                    />
                                )}

                                labelPlacement='start'
                            />
                            <FormControlLabel
                                value='enableSelfValidationJWT'
                                control={(
                                    <Checkbox
                                        checked={enableSelfValidationJWT}
                                        onChange={onChange}
                                        name='enableSelfValidationJWT'
                                        color='primary'
                                    />
                                )}
                                label={(
                                    <FormattedMessage
                                        id='Admin.KeyManager.label.Self.Validate.JWT'
                                        defaultMessage='Self Validate JWT'
                                    />
                                )}
                                labelPlacement='start'
                            />
                            <ExpansionPanel>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
                                >
                                    <Typography className={classes.heading}>Claim Mappings</Typography>
                                </ExpansionPanelSummary>
                                <ClaimMappings
                                    claimMappings={cloneDeep(claimMapping)}
                                    setClaimMapping={setClaimMapping}
                                />
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
                                >
                                    <Typography className={classes.heading}>Connector Configurations</Typography>
                                </ExpansionPanelSummary>
                                <KeyManagerConfiguration
                                    keymanagerConnectorConfigurations={keymanagerConnectorConfigurations}
                                    additionalProperties={cloneDeep(additionalProperties)}
                                    setAdditionalProperties={setAdditionalProperties}
                                />
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
                                >
                                    <Typography className={classes.heading}>Token Handling Options</Typography>
                                </ExpansionPanelSummary>
                                <Button
                                    size='small'
                                    className={classes.button}
                                    onClick={addTokenValidation}
                                >
                                    <AddCircle />
                                    <FormattedMessage
                                        id='KeyManagers.TokenHandling.Empty'
                                        defaultMessage='Add New Token Handling Mechanism'
                                    />
                                </Button>
                                {(isEmpty(tokenValidation)
            || (
                <KeyValidations
                    tokenValidations={tokenValidation}
                    setTokenValidations={setTokenValidations}
                />
            ))}

                            </ExpansionPanel>
                        </Box>
                        <Box m={4} />
                        <Box component='span' m={1}>
                            <Button variant='contained' color='primary' onClick={formSaveCallback}>
                                <FormattedMessage
                                    id='Admin.KeyManager.form.add'
                                    defaultMessage='Add'
                                />
                            </Button>
                        </Box>
                        <RouterLink to='/settings/key-managers'>
                            <Button variant='contained'>
                                <FormattedMessage
                                    id='Admin.KeyManager.form.cancel'
                                    defaultMessage='Cancel'
                                />
                            </Button>
                        </RouterLink>
                    </Grid>
                </Grid>
            </Box>

        </ContentBase>
    );
}

AddEditKeyManager.defaultProps = {
    dataRow: null,
};

AddEditKeyManager.propTypes = {
    dataRow: PropTypes.shape({
        id: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    }),
    triggerButtonText: PropTypes.shape({}).isRequired,
    title: PropTypes.shape({}).isRequired,
};

export default AddEditKeyManager;
