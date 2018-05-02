import React from 'react';
import { Layout } from '../Layout/Layout';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { SearchInput } from '../SearchInput/SearchInput';
import { Contacts } from '../Contacts/Contacts';

export const ContactsPage = () => (
  <Layout
    header={<Header type="contacts" title="Контакты" subtitle="" />}
    content={
      <React.Fragment>
        <SearchInput />
        <Contacts />
      </React.Fragment>
    }
    footer={<Footer path="Контакты" />}
  />
);
