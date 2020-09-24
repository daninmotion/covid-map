/** @jsx jsx */
import { jsx, Heading, Select, Box, Flex, Card, Text } from 'theme-ui';
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import dynamic from 'next/dynamic';
import numeral from 'numeral';

//Relative path imports
// import { Heading } from '../components/Heading';
import SVGIcon from '../components/Icons/index';
// import { prettyPrintStat } from '../helpers/index';

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/WorldMap/index'),
  { ssr: false }
)

const prettyPrintStat = (stat) => {
  return (
    stat ? `+${numeral(stat).format('0,0a')}` : '+0'
  );
}

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('WorldWide');
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  // const [sampleCardData, setCardSample] = useState([
  //   {title: "Total Cases", number: "3.2m", defaultColor: '#ADADAD', secondaryColor: '#FF8B1A'},
  //   {title: "Recovered", number: "12.5k", defaultColor: '#ADADAD', secondaryColor: '#01CB30'}
  // ]);

  //Animation
  const [toggle, setToggle] = useState(!true);
  const [toggle2, setToggle2] = useState(!true);
  const [toggle3, setToggle3] = useState(!true);
  
  const { x, color, fill, backgroundColor } = useSpring({ 
    from: { x: 1 }, x: toggle && casesType === 'cases' ? 1.2 : 1,
    color: toggle && casesType === 'cases' ? '#FF8B1A' : '#ADADAD',
    backgroundColor: toggle && casesType === 'cases' ? '#FAF2EA' : '#2C2C31',
    fill: toggle && casesType === 'cases' ? '#FF8B1A' : '#ADADAD',
  });

  const { x2, color2, fill2, backgroundColor2 } = useSpring({ 
    from: { x2: 1 }, x2: toggle2 && casesType === 'recovered' ? 1.2 : 1,
    color2: toggle2 && casesType === 'recovered' ? '#01CB30' : '#ADADAD',
    backgroundColor2: toggle2 && casesType === 'recovered' ? '#E9FCED' : '#2C2C31',
    fill2: toggle2 && casesType === 'recovered' ? '#01CB30' : '#ADADAD'
  });

  const { x3, color3, fill3, backgroundColor3 } = useSpring({ 
    from: { x3: 1 }, x3: toggle3 && casesType === 'deaths' ? 1.2 : 1,
    color3: toggle3 && casesType === 'deaths' ? '#FF1A1A' : '#ADADAD',
    backgroundColor3: toggle3 && casesType === 'deaths' ? '#ECD9D9' : '#2C2C31',
    fill3: toggle3 && casesType === 'deaths' ? '#FF1A1A' : '#ADADAD'
  });

  const AnimatedCard = animated(Card);
  const AnimatedText = animated(Text);
  const AnimatedHeading = animated(Heading);
  const AnimatedSVGIcon = animated(SVGIcon);


  //General
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
      setToggle(!toggle);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'WorldWide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }

  const onClickAnimateCard1 = (e) => {
    setToggle(!toggle);
    setCasesType('cases');
  }

  // const onClickSetCasesTypeCases = () => {
  //   setCasesType('cases');
  // }

  const onClickAnimateCard2 = (e) => {
    setToggle2(!toggle2);
  }

  const onClickSetCasesTypeRecovered = (e) => {
    setCasesType('recovered');
  }

  const onClickAnimateCard3 = (e) => {
    setToggle3(!toggle3);
  }

  const onClickSetCasesTypeDeaths = (e) => {
    setCasesType('deaths');
  }

  console.log(countryInfo);

  return (
    <React.Fragment>
      <Box sx={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginTop: 3
      }}>
        <Flex>
          <Heading variant='headings.text.heading-3' as='h1' color='grey.6' sx={{ alignSelf: 'center' }}>COVID-19 Tracker</Heading>
          <Box sx={{ maxWidth: '300px', marginLeft: '16px'}}>
            <Flex>
              <Box sx={{
                  'svg': {
                    display: 'none'
                  }
              }}>
                <Select 
                  variant='forms.select.select-ghost' 
                  defaultValue={country}
                  onChange={onCountryChange}
                  color='blue.0'
                  p={0}
                  pr={4}
                >
                  <option value='Worldwide'>Worldwide</option>
                  {
                    countries.map((country, key) => {
                      return (
                        <option key={country.name} value={country.value}>{country.name}</option>
                      );
                    })
                  }
                </Select>
              </Box>
              <SVGIcon 
                width='36px'
                height='36px'
                name='icon-caret-down'
                sx={{
                  marginLeft: '-37px',
                  alignSelf: 'center',
                  flex: 'none'
                }}
              />
            </Flex>
          </Box>
        </Flex>
        <Box sx={{
          display: 'flex',
          marginTop: 4
        }}>
          <AnimatedCard
            onClick={()=> {onClickAnimateCard1();} }
            variant='cards.card-large'
            style={{
              transform: x.interpolate(x => `scale(${x})`),
              color: color,
              backgroundColor: backgroundColor
            }}
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
              height: '152px',
              justifyContent: 'center',
              maxWidth: '213px',
              cursor: 'pointer'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex' }}>
                <AnimatedSVGIcon 
                  width='19px'
                  height='19px'
                  name='icon-virus'
                  fill={fill}
                />
                <AnimatedText sx={{ alignSelf: 'center', marginLeft: '8px' }} variant='text.caption-1'>Total cases</AnimatedText>
              </Box>
              <AnimatedHeading sx={{ marginTop: '8px' }} variant='headings.text.heading-4'>{prettyPrintStat(countryInfo.cases)}</AnimatedHeading>
            </Box>
          </AnimatedCard>

          <AnimatedCard
            onClick={(e)=> {onClickAnimateCard2(e); onClickSetCasesTypeRecovered(e);} }
            variant='cards.card-large'
            style={{
              transform: x2.interpolate(x2 => `scale(${x2})`),
              color: color2,
              backgroundColor: backgroundColor2
            }}
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
              height: '152px',
              justifyContent: 'center',
              maxWidth: '213px',
              marginLeft: 4,
              cursor: 'pointer'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex' }}>
                <AnimatedSVGIcon 
                  width='18px'
                  height='18px'
                  name='icon-heart'
                  fill={fill2}
                />
                <AnimatedText sx={{ alignSelf: 'center', marginLeft: '8px' }} variant='text.caption-1'>Recovered</AnimatedText>
              </Box>
              <AnimatedHeading sx={{ marginTop: '8px' }} variant='headings.text.heading-4'>{prettyPrintStat(countryInfo.recovered)}</AnimatedHeading>
            </Box>
          </AnimatedCard>

          <AnimatedCard
            onClick={(e)=> {onClickAnimateCard3(e); onClickSetCasesTypeDeaths(e);}}
            variant='cards.card-large'
            style={{
              transform: x3.interpolate(x3 => `scale(${x3})`),
              color: color3,
              backgroundColor: backgroundColor3
            }}
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
              height: '152px',
              justifyContent: 'center',
              maxWidth: '213px',
              marginLeft: 4,
              cursor: 'pointer'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex' }}>
                <AnimatedSVGIcon 
                  width='20px'
                  height='20px'
                  name='icon-x'
                  fill={fill3}
                />
                <AnimatedText sx={{ alignSelf: 'center', marginLeft: '8px' }} variant='text.caption-1'>Deaths</AnimatedText>
              </Box>
              <AnimatedHeading sx={{ marginTop: '8px' }} variant='headings.text.heading-4'>{prettyPrintStat(countryInfo.deaths)}</AnimatedHeading>
            </Box>
          </AnimatedCard>
        </Box>
        <Box my={4}>
          <DynamicComponentWithNoSSR 
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default Home;
