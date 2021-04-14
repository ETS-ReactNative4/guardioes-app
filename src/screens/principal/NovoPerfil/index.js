import React, { useState } from 'react'
import { Alert, Modal } from 'react-native'
import moment from 'moment'

import Feather from 'react-native-vector-icons/Feather'

import {
    ModalContainer,
    ModalBox,
    ModalTitle,
    ModalText,
    ModalButton,
    ModalButtonText,
    Container,
    KeyboardScrollView,
    FormInline,
    FormLabel,
    NormalInput,
    FormGroup,
    FormGroupChild,
    Selector,
    DateSelector,
    FormInlineCheck,
    CheckBoxStyled,
    CheckLabel,
    Button,
    SendContainer,
    SendText,
} from '../../../components/NormalForms'

import LoadingModal from '../../../components/Groups/LoadingModal'
import translate from '../../../../locales/i18n'
import { scale } from '../../../utils/scalling'
import {
    genderChoices,
    countryChoices,
    raceChoices,
    householdChoices,
} from '../../../utils/selector'
import { validatePerson } from '../../../utils/consts'
import { useUser } from '../../../hooks/user'
import { createHousehold } from '../../../api/households'

Feather.loadFont()

const NovoPerfil = ({ navigation }) => {
    const { token, user } = useUser()

    const [name, setName] = useState('')
    const [gender, setGender] = useState('')
    const [country, setCountry] = useState('')
    const [race, setRace] = useState('')
    const [birth, setBirth] = useState('')
    const [kinship, setKinship] = useState('')
    const [riskGroup, setRiskGroup] = useState(false)

    const [modalRiskGroup, setModalRiskGroup] = useState(false)
    const [loadingAlert, setLoadingAlert] = useState(false)

    const handleCreate = async () => {
        const household = {
            description: name,
            birthdate: birth,
            country,
            gender,
            race,
            kinship,
            risk_group: riskGroup,
        }

        if (!validatePerson(household, null)) return
        setLoadingAlert(true)

        const response = await createHousehold(household, user.id, token)

        if (response.status === 201) {
            console.warn(response.status)
            setLoadingAlert(false)
            navigation.navigate('Home')
        } else {
            console.warn(response)
            Alert.alert('Ocorreu um erro, tente novamente depois.')
            setLoadingAlert(false)
        }
    }

    return (
        <Container>
            <Modal // Modal for Risk Group Message
                animationType='fade'
                transparent
                visible={modalRiskGroup}
                onRequestClose={() => {
                    setModalRiskGroup(!modalRiskGroup)
                }}
            >
                <ModalContainer>
                    <ModalBox>
                        <ModalTitle>
                            {translate('register.riskGroupTitle')}
                        </ModalTitle>

                        <ModalText>
                            {translate('register.riskGroupMessage')}
                        </ModalText>

                        <Button
                            onPress={() => {
                                setModalRiskGroup(false)
                            }}
                        >
                            <ModalButton>
                                <ModalButtonText>
                                    {translate('register.riskGroupButton')}
                                </ModalButtonText>
                            </ModalButton>
                        </Button>
                    </ModalBox>
                </ModalContainer>
            </Modal>

            <KeyboardScrollView keyboardShouldPersistTaps='always'>
                <FormInline>
                    <FormLabel>{translate('register.name')}</FormLabel>
                    <NormalInput
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                </FormInline>

                <FormGroup>
                    <FormGroupChild>
                        <FormLabel>{translate('register.gender')}</FormLabel>
                        <Selector
                            initValue={translate('selector.label')}
                            cancelText={translate('selector.cancelButton')}
                            data={genderChoices}
                            onChange={(option) => setGender(option.key)}
                        />
                    </FormGroupChild>

                    <FormGroupChild>
                        <FormLabel>{translate('register.race')}</FormLabel>
                        <Selector
                            initValue={translate('selector.label')}
                            cancelText={translate('selector.cancelButton')}
                            data={raceChoices}
                            onChange={(option) => setRace(option.key)}
                        />
                    </FormGroupChild>
                </FormGroup>

                <FormGroup>
                    <FormGroupChild>
                        <FormLabel>{translate('register.birth')}</FormLabel>
                        <DateSelector
                            placeholder={translate('birthDetails.format')}
                            date={birth}
                            format='DD-MM-YYYY'
                            minDate='01-01-1918'
                            maxDate={moment().format('DD-MM-YYYY')}
                            locale='pt-BR'
                            confirmBtnText={translate(
                                'birthDetails.confirmButton'
                            )}
                            cancelBtnText={translate(
                                'birthDetails.cancelButton'
                            )}
                            onDateChange={(date) => setBirth(date)}
                        />
                    </FormGroupChild>

                    <FormGroupChild>
                        <FormLabel>{translate('register.country')}</FormLabel>
                        <Selector
                            initValue={translate('selector.label')}
                            cancelText={translate('selector.cancelButton')}
                            data={countryChoices}
                            onChange={(option) => setCountry(option.key)}
                        />
                    </FormGroupChild>
                </FormGroup>

                <FormInlineCheck>
                    <CheckBoxStyled
                        title={translate('register.riskGroupLabel')}
                        checked={riskGroup}
                        onPress={() => setRiskGroup(!riskGroup)}
                    />
                    <CheckLabel onPress={() => setModalRiskGroup(true)}>
                        <Feather
                            name='help-circle'
                            size={scale(25)}
                            color='#348EAC'
                        />
                    </CheckLabel>
                </FormInlineCheck>

                <FormInline>
                    <FormLabel>Parentesco:</FormLabel>
                    <Selector
                        initValue={translate('selector.label')}
                        cancelText={translate('selector.cancelButton')}
                        data={householdChoices}
                        onChange={(option) => setKinship(option.key)}
                    />
                </FormInline>

                <Button onPress={() => handleCreate()}>
                    <SendContainer>
                        <SendText>Criar</SendText>
                    </SendContainer>
                </Button>
            </KeyboardScrollView>

            <LoadingModal show={loadingAlert} />
        </Container>
    )
}

export default NovoPerfil
