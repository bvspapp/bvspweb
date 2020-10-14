import React from 'react';
import { Switch, Route } from 'react-router-dom';

import AppLayoutUser from '../components/AppLayoutUser';

import Home from '../pages/UserScreens/HomeUser';

import UserProfile from '../pages/UserScreens/UserProfile';

import BvspProducts from '../pages/UserScreens/BvspProducts';
import BvspMachineSearch from '../pages/UserScreens/BvspMachine/BvspMachineSearch';
import BvspMachineDetails from '../pages/UserScreens/BvspMachine/BvspMachineDetails';
import SpecialSolutionSearch from '../pages/UserScreens/SpecialSolutions/SpecialSolutionSearch';
import SpecialSolutionDetails from '../pages/UserScreens/SpecialSolutions/SpecialSolutionDetails';
import BvspServicesSearch from '../pages/UserScreens/BvspServices/BvspServicesSearch';
import BvspServicesDetails from '../pages/UserScreens/BvspServices/BvspServicesDetails';
import BvspPartsStSearch from '../pages/UserScreens/BvspPartsSt/BvspPartsStSearch';
import BvspPartsStDetails from '../pages/UserScreens/BvspPartsSt/BvspPartsStDetails';

import DepartmentsSelect from '../pages/UserScreens/DepartmentsSelect';
import EquipamentsSelect from '../pages/UserScreens/EquipamentsSelect';

import OurPartnersList from '../pages/UserScreens/BvspPartners/OurPartnersList';
import MetaSolutions from '../pages/UserScreens/BvspPartners/MetaSolutions';
import TipsAndNews from '../pages/UserScreens/BvspPartners/TipsAndNews';

import Institutional from '../pages/UserScreens/Institutional';
import Contact from '../pages/UserScreens/Contact';

const UserRoutes: React.FC = () => (
  <AppLayoutUser>
    <Switch>
      <Route path="/" exact component={Home} />

      <Route path="/profile" exact component={UserProfile} />

      <Route path="/bvspproducts" exact component={BvspProducts} />
      <Route path="/bvspmachines" exact component={BvspMachineSearch} />
      <Route path="/bvspmachine/:id" exact component={BvspMachineDetails} />

      <Route path="/specialsolutions" exact component={SpecialSolutionSearch} />
      <Route
        path="/specialsolution/:id"
        exact
        component={SpecialSolutionDetails}
      />

      <Route path="/bvspservices" exact component={BvspServicesSearch} />
      <Route path="/bvspservice/:id" exact component={BvspServicesDetails} />

      <Route
        path="/partsbymachine/:machine_id"
        exact
        component={BvspPartsStSearch}
      />
      <Route path="/part/:id" exact component={BvspPartsStDetails} />

      <Route path="/departments/:to" exact component={DepartmentsSelect} />
      <Route
        path="/equipaments/:department_id"
        exact
        component={EquipamentsSelect}
      />

      <Route path="/ourpartners" exact component={OurPartnersList} />
      <Route path="/metasolutions" exact component={MetaSolutions} />
      <Route path="/tipsnews" exact component={TipsAndNews} />

      <Route path="/institutional" exact component={Institutional} />
      <Route path="/contact" exact component={Contact} />
    </Switch>
  </AppLayoutUser>
);

export default UserRoutes;
